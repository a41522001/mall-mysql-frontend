export type Header = Record<string, any>;
export type TableItem = Record<string, any>;
type Variant = 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain';
type PrependAndAppendValue = {
  text: string;
  method?: (item: TableItem, index: number) => void;
  variant?: Variant;
  color?: string;
  className?: string;
}
export interface PrependAndAppend {
  key: string,
  title: string,
  sortable?: boolean,
  width?: number | string,
  align?: 'start' | 'center' | 'end';
  value: PrependAndAppendValue[];
}
export interface Props {
  headers: Header[];
  items: TableItem[];
  itemKey: string;
  noFooter?: boolean;
  prepend?: PrependAndAppend | undefined;
  append?: PrependAndAppend | undefined;
}