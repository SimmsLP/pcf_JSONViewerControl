import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { JSONValue, JSONViewer } from "./JSONViewer"; // Imports your JSONViewer.tsx component

// Optionally define an interface for error objects in JSON.
interface ErrorJSON {
  error: string;
  [key: string]: JSONValue;
}

export class JSONViewerControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container: HTMLDivElement;
    private updatedJsonString = "";

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.container = container;
        this.container.style.textAlign = "left";

        // Make the container resizable
        container.style.resize = "both";       // Can be "horizontal", "vertical", or "both"
        container.style.overflow = "auto";     // Ensures scrollbars appear if content grows
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Retrieve the raw JSON string from the bound property
        const rawJson = context.parameters.jsonData.raw ?? "";
        let parsedJson: JSONValue | ErrorJSON;
        try {
            parsedJson = rawJson ? JSON.parse(rawJson) : {};
        } catch (e) {
            parsedJson = { error: e instanceof Error ? e.message : "Unknown error" };
        }

        // Render your React component using React.createElement (no JSX here)
        ReactDOM.render(
            React.createElement(JSONViewer, {
                jsonData: parsedJson,
                onChange: (updatedSrc: JSONValue) => {
                    // Capture any updates if two-way editing is desired
                    this.updatedJsonString = JSON.stringify(updatedSrc, null, 2);
                    // Uncomment the next line if you want to notify Power Apps of changes
                    // notifyOutputChanged();
                }
            }),
            this.container
        );
    }

    public getOutputs(): IOutputs {
        // Return updated JSON if two-way binding is enabled
        return { jsonData: this.updatedJsonString } as IOutputs;
    }

    public destroy(): void {
        // Unmount the React component when the control is removed
        ReactDOM.unmountComponentAtNode(this.container);
    }
}
