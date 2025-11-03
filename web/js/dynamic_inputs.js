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

            // Store all widgets on first creation
            if (!this._allWidgets) {
                this._allWidgets = [...this.widgets];
            }

            // Function to rebuild widget list based on inputcount
            const updateVisibleWidgets = () => {
                const inputcountWidget = this._allWidgets.find(w => w.name === "inputcount");
                if (!inputcountWidget) return;

                const targetCount = inputcountWidget.value;

                // Rebuild widgets array: inputcount + prompt_1 to prompt_N
                this.widgets = [inputcountWidget];

                for (let i = 1; i <= targetCount; i++) {
                    const widget = this._allWidgets.find(w => w.name === `prompt_${i}`);
                    if (widget) {
                        this.widgets.push(widget);
                    }
                }

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
