import type {
  ProgramArguments,
  ArgumentMap,
  ArgumentMapOptions,
} from "../typings";
import { debug } from "debug";

export class NodeArgs {
  private static log = debug("NodeArgs");

  public static parse(args: string[], map: ArgumentMap): ProgramArguments {
    let programDefaults = this.programDefaults(map);

    return args.reduce((programArgs, currentValue, index, listOfArguments) => {
      const option = NodeArgs.findOption(map, currentValue);
      // * The current value is not a flag
      if (option == null) {
        return programArgs;
      }
      let argumentType = option.config.type ?? "string";
      if (option.config.toggleFlag) {
        this.log("Toggle Flag Set %o => %o", option.name, true);
        programArgs[option.name] = true;
        return programArgs;
      }

      const immediateValue: string = listOfArguments[index + 1];
      if (immediateValue === undefined) {
        this.log("Immediate value is undefined from CLI");
        return programArgs;
      }
      let argValue: string | number | boolean;
      switch (argumentType) {
        case "string":
          argValue = immediateValue;
          break;
        case "boolean":
          if (
            immediateValue === "1" ||
            immediateValue === "true" ||
            immediateValue === "y" ||
            immediateValue === "yes"
          ) {
            argValue = true;
          } else if (
            immediateValue === "0" ||
            immediateValue === "false" ||
            immediateValue === "n" ||
            immediateValue === "no"
          ) {
            argValue = false;
          } else {
            this.log("Cannot reliably cast %o to boolean", immediateValue);
            return programArgs;
          }
          break;
        case "number":
          argValue = parseInt(immediateValue, 10);
          break;
      }

      // * Set the value to the immediately succeeding element if not defined, otherwise set to default value

      this.log("Option: %o => %o", option, argValue);

      programArgs[option.name] = argValue;
      return programArgs;
    }, programDefaults) as ProgramArguments;
  }

  private static programDefaults(map: ArgumentMap): ProgramArguments {
    this.log("Setting Defaults");
    const programDefaults = Object.entries(map)
      // Filtering for only when defaultValue is defined
      .filter(([_, options]) => {
        if (options.defaultValue === undefined) return false;
        return true;
      })
      // Simple map for use in the reduce later
      .map((value) => {
        const [name, options] = value;
        return { name, defaultValue: options.defaultValue };
      })
      // Reduce to Program Arguments
      .reduce((programDef, curr) => {
        programDef[curr.name] = curr.defaultValue;
        return programDef;
      }, {} as ProgramArguments) as ProgramArguments;
    this.log("Default Set %O", programDefaults);
    return programDefaults;
  }

  private static findOption(
    map: ArgumentMap,
    value: string
  ): { name: string; config: ArgumentMapOptions } | null {
    for (let [name, config] of Object.entries(map)) {
      if (config.optionVariants.includes(value)) {
        this.log("Flag identified %o as argument %o", value, name);
        return { name, config };
      }
      continue;
    }
    this.log("%o is not flag", value);
    return null;
  }
}
