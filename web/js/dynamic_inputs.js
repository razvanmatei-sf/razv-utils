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

            // Store all 51 widgets (inputcount + prompt_1 to prompt_50)
            this._allWidgets = [...this.widgets];

            // Function to rebuild widget list based on inputcount
            const updateVisibleWidgets = () => {
                const inputcountWidget = this._allWidgets.find(w => w.name === "inputcount");
                if (!inputcountWidget) return;

                const targetCount = inputcountWidget.value;

                // Build new widgets array with only visible widgets
                const newWidgets = [inputcountWidget];

                // Add only the widgets we want to show (prompt_1 to prompt_N)
                for (let i = 1; i <= Math.min(targetCount, 50); i++) {
                    const widget = this._allWidgets.find(w => w.name === `prompt_${i}`);
                    if (widget) {
                        newWidgets.push(widget);
                    }
                }

                // Replace the widgets array completely
                this.widgets = newWidgets;

                // Recompute size and redraw
                this.setSize(this.computeSize());
                this.setDirtyCanvas(true, true);
            };

            // Hook into inputcount changes
            const inputcountWidget = this.widgets.find(w => w.name === "inputcount");
            if (inputcountWidget) {
                const originalCallback = inputcountWidget.callback;
                const self = this;
                inputcountWidget.callback = function(value) {
                    if (originalCallback) {
                        originalCallback.apply(this, arguments);
                    }
                    updateVisibleWidgets.call(self);
                };
            }

            // Initial update on node load
            setTimeout(() => updateVisibleWidgets(), 50);

            return r;
        };
    }
});
