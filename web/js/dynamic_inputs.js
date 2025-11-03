/**
 * Dynamic Text Boxes Extension for Dynamic Prompt List Node
 * Creates text box widgets dynamically (no input connections)
 */

import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "Serhii.DynamicPromptList",

    async nodeCreated(node) {
        if (node.comfyClass !== "Dynamic Prompt List") {
            return;
        }

        // Create initial text boxes
        const inputcountWidget = node.widgets.find(w => w.name === "inputcount");
        const initialCount = inputcountWidget ? inputcountWidget.value : 5;

        // Add initial text box widgets
        for (let i = 1; i <= initialCount; i++) {
            node.addWidget("text", `prompt_${i}`, "", () => {}, {
                multiline: true,
                serialize: true
            });
        }

        // Add Update inputs button
        node.addWidget("button", "Update inputs", null, () => {
            updatePrompts(node);
        });

        // Initial resize
        node.setSize(node.computeSize());
    }
});

function updatePrompts(node) {
    const inputcountWidget = node.widgets.find(w => w.name === "inputcount");
    if (!inputcountWidget) return;

    const targetCount = inputcountWidget.value;

    // Count current prompt text boxes (exclude inputcount and button)
    const currentPrompts = node.widgets.filter(w =>
        w.name && w.name.startsWith("prompt_") && w.type === "text"
    );
    const currentCount = currentPrompts.length;

    if (targetCount === currentCount) return;

    // Remove excess widgets
    if (targetCount < currentCount) {
        const toRemove = currentCount - targetCount;
        for (let i = 0; i < toRemove; i++) {
            const promptWidgets = node.widgets.filter(w =>
                w.name && w.name.startsWith("prompt_") && w.type === "text"
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
            node.addWidget("text", `prompt_${i}`, "", () => {}, {
                multiline: true,
                serialize: true
            });
        }
    }

    // Resize node
    node.setSize(node.computeSize());
    node.setDirtyCanvas(true, true);
}
