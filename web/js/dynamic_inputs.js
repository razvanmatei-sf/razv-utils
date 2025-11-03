/**
 * Dynamic Prompt List - Hide/Show Widgets Based on inputcount
 */

import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "Serhii.DynamicPromptList",

    async nodeCreated(node) {
        if (node.comfyClass !== "Dynamic Prompt List") {
            return;
        }

        // Function to update widget visibility
        const updateVisibility = () => {
            const inputcountWidget = node.widgets.find(w => w.name === "inputcount");
            if (!inputcountWidget) return;

            const targetCount = inputcountWidget.value;

            // Find all prompt widgets
            const promptWidgets = node.widgets.filter(w =>
                w.name && w.name.startsWith("prompt_") && w.type !== "button"
            );

            // Hide/show widgets based on inputcount
            promptWidgets.forEach((widget, index) => {
                const promptNum = parseInt(widget.name.split("_")[1]);

                if (promptNum <= targetCount) {
                    widget.type = "text"; // Show
                    delete widget.computeSize;
                    delete widget.hidden;
                } else {
                    // Hide by making it take no space
                    widget.type = "hidden";
                    widget.computeSize = () => [0, 0];
                }
            });

            // Resize node
            const newSize = node.computeSize();
            node.setSize(newSize);
            node.setDirtyCanvas(true, true);
        };

        // Watch for inputcount changes
        const inputcountWidget = node.widgets.find(w => w.name === "inputcount");
        if (inputcountWidget) {
            const originalCallback = inputcountWidget.callback;
            inputcountWidget.callback = function() {
                if (originalCallback) originalCallback.apply(this, arguments);
                updateVisibility();
            };
        }

        // Initial visibility update
        setTimeout(() => updateVisibility(), 100);
    }
});
