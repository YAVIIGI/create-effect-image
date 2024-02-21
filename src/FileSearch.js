export const searchDirectory = async () => {
    return await window.showDirectoryPicker()
}

export const getFiles = async (directoryHandler, enableSubDirectory = true, filterTypes = ['image/gif', 'image/png', 'image/jpg', 'image/jpeg']) => {
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
    return list;
}