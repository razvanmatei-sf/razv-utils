/**
 * Dynamic Text Boxes Extension for Dynamic Prompt List Node
 * Creates text box widgets dynamically based on inputcount
 */

import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "Serhii.DynamicPromptList",

    async nodeCreated(node) {
        if (node.comfyClass !== "Dynamic Prompt List") {
            return;
        }

        // Initialize with default number of text boxes
        const inputcountWidget = node.widgets.find(w => w.name === "inputcount");
        if (inputcountWidget) {
            const initialCount = inputcountWidget.value || 5;
            for (let i = 1; i <= initialCount; i++) {
                node.addWidget("text", `prompt_${i}`, "", () => {}, {
                    multiline: true,
                    serialize: true
                });
            }
        }

        // Add "Update inputs" button
        node.addWidget("button", "Update inputs", null, () => {
            updateTextBoxes(node);
        });

        // Initial resize
        node.setSize(node.computeSize());
    }
});

function updateTextBoxes(node) {
    const inputcountWidget = node.widgets.find(w => w.name === "inputcount");
    if (!inputcountWidget) return;

    const targetCount = inputcountWidget.value;

    // Count current prompt text boxes (not button or inputcount)
    const currentPrompts = node.widgets.filter(w =>
        w.name && w.name.startsWith("prompt_") && w.type !== "button"
    );
    const currentCount = currentPrompts.length;

    if (targetCount === currentCount) return;

    // Remove excess text boxes
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
    // Add new text boxes
    else {
        for (let i = currentCount + 1; i <= targetCount; i++) {
            node.addWidget("text", `prompt_${i}`, "", () => {}, {
                multiline: true,
                serialize: true
            });
        }
    }

    // Resize node to fit
    node.setSize(node.computeSize());
    node.setDirtyCanvas(true, true);
}
