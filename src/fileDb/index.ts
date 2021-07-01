export class FileDB {
    items: { name: string, contents: string }[] = [];
    primaryFile: string | undefined;

    static parse(reader: BinaryReadHandle): FileDB {
        const fileDB = new FileDB();

        const primaryFileLength = (reader.read()!) + (reader.read()! * 256);
        const primaryFile = reader.read(primaryFileLength);

        if (primaryFile === undefined) {
            throw new Error("missing primary file");
        }

        fileDB.setPrimaryFile(primaryFile);

        let doContinue = true;

        while (doContinue) {
            const fileNameLength = (reader.read()!) + (reader.read()! * 256);
            const fileName = reader.read(fileNameLength);

            if (fileName === undefined) {
                throw new Error("Missing file name");
            }

            const fileContentsLength = (reader.read()!) + (reader.read()! * 256) + (reader.read()! * 65536) + (reader.read()! * 16777216);
            const fileContents = reader.read(fileContentsLength);

            if (fileContents === undefined) {
                throw new Error("Missing file contents");
            }

            fileDB.add({
                name: fileName,
                contents: fileContents,
            });

            if (reader.read() == 1) doContinue = false
        }

        return fileDB;
    }

    setPrimaryFile(name: string): void {
      this.primaryFile = name;
    }
  
    add(item: { name: string, contents: string }): void {
      this.items.push(item);
    }

    list(): { name: string, contents: string }[] {
        return this.items;
    }

    getPrimaryFile(): string {
        if (this.primaryFile === undefined) {
            throw new Error("No primary file!");
        }

        return this.primaryFile;
    }
}