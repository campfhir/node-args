export type ProgramArguments = {
  [flag: string]: any;
};

type ArgumentMapOptions = {
  optionVariants: string[];
  defaultValue?: any;
  toggleFlag?: true;
  type?: "string" | "boolean" | "number";
};

export type ArgumentMap = {
  [nameOfArgument: string]: ArgumentMapOptions;
};
