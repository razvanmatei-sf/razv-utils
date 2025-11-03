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
            this._allWidgets = [...this.widgets];

            console.log(`Dynamic Prompt List: Node created with ${this._allWidgets.length} total widgets`);

            // Function to rebuild widget list based on inputcount
            const updateVisibleWidgets = () => {
                const inputcountWidget = this._allWidgets.find(w => w.name === "inputcount");
                if (!inputcountWidget) {
                    console.error("Dynamic Prompt List: inputcount widget not found!");
                    return;
                }

                const targetCount = inputcountWidget.value;
                console.log(`Dynamic Prompt List: Updating to show ${targetCount} prompts`);

                // Rebuild widgets array: inputcount + prompt_1 to prompt_N
                this.widgets.length = 0; // Clear array
                this.widgets.push(inputcountWidget);

                for (let i = 1; i <= targetCount; i++) {
                    const widget = this._allWidgets.find(w => w.name === `prompt_${i}`);
                    if (widget) {
                        this.widgets.push(widget);
                    }
                }

                console.log(`Dynamic Prompt List: Now showing ${this.widgets.length} widgets (1 inputcount + ${targetCount} prompts)`);

                // Force node to recompute size
                const size = this.computeSize();
                this.setSize(size);
                this.setDirtyCanvas(true, true);
            };

            // Hook into inputcount changes
            const inputcountWidget = this.widgets.find(w => w.name === "inputcount");
            if (inputcountWidget) {
                const originalCallback = inputcountWidget.callback;
                const self = this;
                inputcountWidget.callback = function(value) {
                    console.log(`Dynamic Prompt List: inputcount changed to ${value}`);
                    if (originalCallback) {
                        originalCallback.apply(this, arguments);
                    }
                    updateVisibleWidgets.call(self);
                };
            }

            // Initial update - run immediately and after delay
            updateVisibleWidgets();
            setTimeout(() => updateVisibleWidgets(), 10);
            setTimeout(() => updateVisibleWidgets(), 100);

            return r;
        };
    }
});
