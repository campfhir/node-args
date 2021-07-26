import "mocha";
import chai, { expect } from "chai";
import { NodeArgs } from "../src";
import { ArgumentMap } from "../typings";

chai.should();

describe("Given a list of commands, options, flags, and, mapping", () => {
  describe("When parsed", () => {
    it("Then an object of options and their corresponding values are generated.", () => {
      const example1 = [
        "/usr/bin/node",
        "/home/user/project/index.js",
        "-d",
        "/var/logs",
        "--verbose",
        "-c",
        "20",
        "-e",
        "true",
        "-net",
        "0",
        "-dl",
        "yup",
        "-u",
      ];
      const argumentMap: ArgumentMap = {
        logDirectory: {
          optionVariants: ["-d", "--directory"],
          defaultValue: "/var/logs",
          type: "string",
        },
        debug: {
          optionVariants: ["--debug"],
          defaultValue: false,
          type: "boolean",
        },
        port: {
          optionVariants: ["-p", "--port"],
          type: "number",
        },
        verbose: {
          optionVariants: ["-v", "--verbose"],
          toggleFlag: true,
          type: "boolean",
        },
        numberOfConnections: {
          optionVariants: ["-c"],
          type: "number",
        },
        useTls: {
          optionVariants: ["-tls", "-e"],
          type: "boolean",
        },
        allowNetworking: {
          optionVariants: ["-net"],
          type: "boolean",
        },
        allowDownload: {
          optionVariants: ["-dl"],
          type: "boolean",
        },
        unknown: {
          optionVariants: ["-u"],
        },
      };
      const programArguments = NodeArgs.parse(example1, argumentMap);
      expect(programArguments["logDirectory"]).to.equal(example1[3]);
      expect(programArguments["debug"]).to.be.false;
      expect(programArguments["port"]).to.be.undefined;
      expect(programArguments["verbose"]).to.be.true;
      expect(programArguments["numberOfConnection"]).to.be.undefined;
    });
  });
});
