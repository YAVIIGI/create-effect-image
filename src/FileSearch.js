export const searchDirectory = async () => {
    return await window.showDirectoryPicker()
}

export const getFiles = async (directoryHandler, enableSubDirectory = true, filterTypes = ['image/gif', 'image/png', 'image/jpg', 'image/jpeg']) => {
    let list = await new Promise(async (resolve) => {
        let list = []
        for await (let [name, handle] of directoryHandler) {
            switch (handle.kind) {
                case 'file':
                    let fileData = await handle.getFile();
                    filterTypes.forEach(async (type) => {
                        if (fileData.type === type) {
                            list.push({
                                data: URL.createObjectURL(await handle.getFile()),
                                name: name,
                            })
                        }
                    });
                    break;
                case 'directory':
                    if (enableSubDirectory) {
                        list = list.concat(await getFiles(await directoryHandler.getDirectoryHandle(handle.name)))
                    }
                    break;
                default:
                    break;
            }
        }
        await new Promise(async(resolve) => { await setTimeout(()=>{resolve()},100)})
        list.sort((a,b) => { return a.name < b.name ? -1 : 1})
        resolve(list)
    });
    return list;
}