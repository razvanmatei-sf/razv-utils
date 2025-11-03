/**
 * Dynamic Prompt List - Show only the number of widgets specified by inputcount
 */

import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "Serhii.DynamicPromptList",

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name !== "Dynamic Prompt List") {
            return;
        }

        const onNodeCreated = nodeType.prototype.onNodeCreated;
        nodeType.prototype.onNodeCreated = function () {
            const r = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined;

            // Store original widgets
            this._allPromptWidgets = this.widgets.filter(w =>
                w.name && w.name.startsWith("prompt_")
            );

            // Function to update visible widgets
            const updateVisibleWidgets = () => {
                const inputcountWidget = this.widgets.find(w => w.name === "inputcount");
                if (!inputcountWidget) return;

                const targetCount = inputcountWidget.value;

                // Hide/show widgets by setting their options
                this._allPromptWidgets.forEach(widget => {
                    const promptNum = parseInt(widget.name.split("_")[1]);

                    if (promptNum > targetCount) {
                        // Hide widget
                        widget.options = widget.options || {};
                        widget.options.hidden = true;
                        widget.computeSize = function() { return [0, -4]; }; // Negative height to hide
                    } else {
                        // Show widget
                        if (widget.options) {
                            delete widget.options.hidden;
                        }
                        delete widget.computeSize;
                    }
                });

                // Force node to recompute size
                this.setSize(this.computeSize());
                this.setDirtyCanvas(true, true);
            };

            // Hook into inputcount changes
            const inputcountWidget = this.widgets.find(w => w.name === "inputcount");
            if (inputcountWidget) {
                const originalCallback = inputcountWidget.callback;
                inputcountWidget.callback = function(value) {
                    if (originalCallback) {
                        originalCallback.apply(this, arguments);
                    }
                    updateVisibleWidgets();
                };
            }

            // Initial update
            setTimeout(() => updateVisibleWidgets(), 100);

            return r;
        };
    }
});
