import React, { useEffect, useState } from 'react'
import { getFiles, searchDirectory } from './FileSearch'

function App() {
  const [png, setPng] = useState(null)

  useEffect(() => {
  }, [])


  const LoadImage = async (data) => {
    var flag = false
    let img1 = new Image();
    img1.src = data;
    img1.alt = "alt";
    img1.addEventListener(
      "load",
      () => {
        console.log(`finishLoad ${data}`)
        flag = true
      }
    );
    while (!flag) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return img1
  }

  const render = async () => {
    let list = await new Promise(async (resolve) => {
      resolve((await getFiles(await searchDirectory())))
    });

    let listWidth = 1
    for (let i = 1; i < 10; i++) {
      if (i * i < list.length) listWidth = i;
    }

    const canvasElem = document.createElement('canvas')
    const width = 512 * listWidth
    const height = 512 * listWidth
    canvasElem.width = width
    canvasElem.height = height
    const ctx = canvasElem.getContext('2d')

    new Promise(async (resolve) => {
      let listData = []
      for (let i = 0; i < listWidth * listWidth; i++) {
        listData.push(await LoadImage(list[i].data));
      }
      resolve(listData)
    }).then((value) => {
      console.log(value[0])
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < listWidth; i++) {
        for (let j = 0; j < listWidth; j++) {
          ctx.drawImage(value[i * listWidth + j], j * 512, i * 512, 512, 512)
        }
      }
      setPng(canvasElem.toDataURL())
    })
  }

  return (
    <div>
      <h3>画像生成</h3>
      <h4>生成</h4>
      <button onClick={() => {
        render()
      }}>press</button>
      {png && (
        <div className="comp" style={{ display: 'flex' }}>
          <img alt="icon" src={png} width={'100%'} />
        </div>
      )}
    </div>
  )
}
export default App