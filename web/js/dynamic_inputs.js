/**
 * Dynamic Text Boxes Extension for Dynamic Prompt List Node
 * Manages existing widgets from INPUT_TYPES, adds/removes as needed
 */

import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "Serhii.DynamicPromptList",

    async nodeCreated(node) {
        if (node.comfyClass !== "Dynamic Prompt List") {
            return;
        }

        // Add Update inputs button after existing widgets
        node.addWidget("button", "Update inputs", null, () => {
            updatePrompts(node);
        });
    }
});

function updatePrompts(node) {
    const inputcountWidget = node.widgets.find(w => w.name === "inputcount");
    if (!inputcountWidget) return;

    const targetCount = inputcountWidget.value;

    // Count current prompt text boxes (exclude inputcount and button)
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
    // Add new widgets (matching INPUT_TYPES format)
    else {
        // Find the button widget position
        const buttonIndex = node.widgets.findIndex(w => w.type === "button");

        for (let i = currentCount + 1; i <= targetCount; i++) {
            const newWidget = node.addCustomWidget({
                name: `prompt_${i}`,
                type: "customtext",
                value: "",
                callback: () => {},
                options: { multiline: true }
            });

            // Move new widget before the button
            if (buttonIndex > -1 && newWidget) {
                const widgetIndex = node.widgets.indexOf(newWidget);
                if (widgetIndex > buttonIndex) {
                    node.widgets.splice(widgetIndex, 1);
                    node.widgets.splice(buttonIndex, 0, newWidget);
                }
            }
        }
    }

    // Resize node
    node.setSize(node.computeSize());
    node.setDirtyCanvas(true, true);
}
