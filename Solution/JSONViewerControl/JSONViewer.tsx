import * as React from 'react';
import ReactJson, {InteractionProps} from "react-json-view";

// Define a recursive type for valid JSON values.
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

// Define an error type that fits the JSONValue structure.
export interface ErrorJSON {
  error: string;
  [key: string]: JSONValue;
}

interface JSONViewerProps {
  jsonData: JSONValue | ErrorJSON;
  onChange?: (updatedSrc: JSONValue) => void;
}

export const JSONViewer: React.FC<JSONViewerProps> = ({ jsonData, onChange }) => {
  // If jsonData has an error, display it.
  if ((jsonData as ErrorJSON).error !== undefined) {
    return <div style={{ color: 'red' }}>Error: {(jsonData as ErrorJSON).error}</div>;
  }
  
  return (
    <ReactJson
      src={(jsonData === null ? {} : jsonData) as object} // No cast here; jsonData is already JSONValue | ErrorJSON, which should be acceptable.
      name={null}
      theme="monokai"
      collapsed={1}
      enableClipboard={true}
      displayDataTypes={false}
      displayObjectSize={false}
      onEdit={(edit: InteractionProps) => {
        onChange?.(edit.updated_src as JSONValue);
      }}
      onAdd={(add: InteractionProps) => {
        onChange?.(add.updated_src as JSONValue);
      }}
      onDelete={(del: InteractionProps) => {
        onChange?.(del.updated_src as JSONValue);
      }}
    />
  );
};
