/**
 * Dynamic Inputs Extension for Dynamic Prompt List Node
 * Adds dynamic input functionality with "Update inputs" button
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

            this._type = "STRING";

            // Add "Update inputs" button
            this.addWidget("button", "Update inputs", null, () => {
                if (!this.inputs) {
                    this.inputs = [];
                }

                // Get the target number of inputs from the inputcount widget
                const target_number_of_inputs = this.widgets.find(w => w.name === "inputcount")["value"];

                // Count current prompt inputs
                const num_inputs = this.inputs.filter(input =>
                    input.name && input.name.toLowerCase().includes("prompt_")
                ).length;

                // If already at target, do nothing
                if (target_number_of_inputs === num_inputs) return;

                // Remove excess inputs
                if (target_number_of_inputs < num_inputs) {
                    const inputs_to_remove = num_inputs - target_number_of_inputs;
                    for (let i = 0; i < inputs_to_remove; i++) {
                        // Find and remove the last prompt_ input
                        for (let j = this.inputs.length - 1; j >= 0; j--) {
                            if (this.inputs[j].name && this.inputs[j].name.toLowerCase().includes("prompt_")) {
                                this.removeInput(j);
                                break;
                            }
                        }
                    }
                }
                // Add new inputs
                else {
                    for (let i = num_inputs + 1; i <= target_number_of_inputs; ++i) {
                        this.addInput(`prompt_${i}`, this._type);
                    }
                }
            });
        }
    }
});
