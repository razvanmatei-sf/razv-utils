/**
 * Dynamic Widgets Extension for Dynamic Prompt List Node
 * Adds dynamic text box widgets functionality with "Update inputs" button
 */

import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "Serhii.DynamicPromptList",

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Only apply to Dynamic Prompt List node
        if (nodeData.name !== "Dynamic Prompt List") {
            return;
        }

        const originalOnNodeCreated = nodeType.prototype.onNodeCreated || function() {};

        nodeType.prototype.onNodeCreated = function() {
            originalOnNodeCreated.apply(this, arguments);

            // Add "Update inputs" button
            this.addWidget("button", "Update inputs", null, () => {
                if (!this.widgets) {
                    this.widgets = [];
                }

                // Get the target number of text boxes from the inputcount widget
                const inputcountWidget = this.widgets.find(w => w.name === "inputcount");
                if (!inputcountWidget) return;

                const target_number_of_prompts = inputcountWidget.value;

                // Count current prompt widgets (excluding inputcount and the button itself)
                const current_prompts = this.widgets.filter(w =>
                    w.name && w.name.startsWith("prompt_")
                ).length;

                // If already at target, do nothing
                if (target_number_of_prompts === current_prompts) return;

                // Remove excess widgets
                if (target_number_of_prompts < current_prompts) {
                    const widgets_to_remove = current_prompts - target_number_of_prompts;
                    for (let i = 0; i < widgets_to_remove; i++) {
                        // Find and remove the last prompt_ widget
                        const promptWidgets = this.widgets.filter(w =>
                            w.name && w.name.startsWith("prompt_")
                        );
                        if (promptWidgets.length > 0) {
                            const lastPrompt = promptWidgets[promptWidgets.length - 1];
                            const index = this.widgets.indexOf(lastPrompt);
                            if (index > -1) {
                                this.widgets.splice(index, 1);
                            }
                        }
                    }
                }
                // Add new widgets
                else {
                    for (let i = current_prompts + 1; i <= target_number_of_prompts; i++) {
                        this.addWidget(
                            "text",
                            `prompt_${i}`,
                            "prompt",
                            (value) => {},
                            {}
                        );
                    }
                }

                // Force node to resize
                this.setSize(this.computeSize());
            });
        }
    }
});
