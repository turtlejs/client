import { FileDB } from "./src/fileDb";
import * as ccRequire from "cc/require";
import { Console } from "./src/console";

const inpArgs = arguments;

function downloadProgram(program: string): string {
  const [response, e, errorResponse] = http.get(`http${inpArgs.indexTokens.includes("s") ? "s" : ""}://${inpArgs.namedTokens.host}:${inpArgs.namedTokens.port}/${program}`, undefined, true);

  if (response === undefined) {
    throw new Error(e);
  }

  const fileDb = FileDB.parse(response);

  const primaryFile = fileDb.getPrimaryFile();
  const files = fileDb.list();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const [handle, e] = fs.open(`/turtlejs/prog/${program}/${file.name}`, "wb")
    
    if (handle == undefined) {
      throw new Error(e!);
    }

    handle.write(file.contents);
  }

  return primaryFile;
}

if (arguments.namedTokens.run === undefined) {
  throw new Error("Missing argument: \"run\". Run is expected to be the name of the program you want to run");
}

const primaryFile = downloadProgram(arguments.namedTokens.run);

const [require] = ccRequire.make({
  console: new Console()
}, `/turtlejs/prog/${arguments.namedTokens.run}/`)

const c = require(primaryFile);

new c.default();

/**
 * TODO: WRITE MODULE SYSTEM
 */