/**
 * Dynamic Inputs Extension for Dynamic Prompt List Node
 * Manages dynamic STRING inputs in INPUT_TYPES
 */

import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "Serhii.DynamicPromptList",

    async nodeCreated(node) {
        if (node.comfyClass !== "Dynamic Prompt List") {
            return;
        }

        // Add "Update inputs" button
        const updateButton = node.addWidget("button", "Update inputs", null, () => {
            const inputcountWidget = node.widgets.find(w => w.name === "inputcount");
            if (!inputcountWidget) return;

            const targetCount = inputcountWidget.value;
            const currentPrompts = node.widgets.filter(w => w.name && w.name.startsWith("prompt_"));
            const currentCount = currentPrompts.length;

            if (targetCount === currentCount) return;

            // Remove excess widgets
            if (targetCount < currentCount) {
                const toRemove = currentCount - targetCount;
                for (let i = 0; i < toRemove; i++) {
                    const promptWidgets = node.widgets.filter(w => w.name && w.name.startsWith("prompt_"));
                    if (promptWidgets.length > 0) {
                        const lastWidget = promptWidgets[promptWidgets.length - 1];
                        const index = node.widgets.indexOf(lastWidget);
                        if (index > -1) {
                            node.widgets.splice(index, 1);
                        }
                    }
                }
            }
            // Add new widgets
            else {
                for (let i = currentCount + 1; i <= targetCount; i++) {
                    node.addWidget("string", `prompt_${i}`, "prompt", () => {}, {
                        multiline: true
                    });
                }
            }

            // Resize node to fit new widgets
            node.setSize(node.computeSize());
            node.setDirtyCanvas(true);
        });
    }
});
