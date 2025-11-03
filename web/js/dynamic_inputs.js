/**
 * Dynamic Inputs Extension for Dynamic Prompt List Node
 * Manages dynamic STRING widgets based on inputcount
 */

import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "Serhii.DynamicPromptList",

    async nodeCreated(node) {
        if (node.comfyClass !== "Dynamic Prompt List") {
            return;
        }

        // Find the Update inputs button widget and override its callback
        const updateButton = node.widgets.find(w => w.type === "button" && w.name === "Update inputs");

        if (!updateButton) {
            // If button doesn't exist, add it
            node.addWidget("button", "Update inputs", null, () => {
                updatePrompts(node);
            });
        } else {
            // Override existing button callback
            updateButton.callback = () => {
                updatePrompts(node);
            };
        }
    }
});

function updatePrompts(node) {
    const inputcountWidget = node.widgets.find(w => w.name === "inputcount");
    if (!inputcountWidget) return;

    const targetCount = inputcountWidget.value;

    // Count current prompt widgets (not the button or inputcount)
    const currentPrompts = node.widgets.filter(w =>
        w.name && w.name.startsWith("prompt_") && w.type !== "button"
    );
    const currentCount = currentPrompts.length;

    if (targetCount === currentCount) return;

    // Remove excess widgets
    if (targetCount < currentCount) {
        const toRemove = currentCount - targetCount;
        for (let i = 0; i < toRemove; i++) {
            const promptWidgets = node.widgets.filter(w =>
                w.name && w.name.startsWith("prompt_") && w.type !== "button"
            );
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
            const widget = node.addWidget("text", `prompt_${i}`, "", () => {}, {
                multiline: true,
                serialize: true
            });
        }
    }

    // Resize node
    node.setSize(node.computeSize());
    node.setDirtyCanvas(true, true);
}
