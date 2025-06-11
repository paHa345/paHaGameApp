// const installEvent = () => {
//   self.addEventListener('install', () => {
//     console.log('service worker installed');
//   });
// };
// installEvent();

// const activateEvent = () => {
//   self.addEventListener('activate', () => {
//     console.log('service worker activated');
//   });
// };
// activateEvent();

// console.log('asdasd')

// self.addEventListener(('message', (event)=>{
//   console.log('work')
//   self.postMessage('work')
// }))

self.onmessage = function (e) {
    if(e.data.type === 'setGameComplexity'){
        console.log('setGameComplexity')
        self.postMessage(`setGameComplexity:${e.data.message}`);
    }
    if(e.data.type === "Some input data"){
        const result = heavyComputation(e.data);
      //   self.postMessage(result);
            setTimeout(()=> {
        self.postMessage(`Processed data:${Date.now()}`);
      
          }, 5000)
      };

      if(e.data.type==='close'){
          self.close()
      }
                self.close()


    }

function heavyComputation(data) {
  // Simulate intensive computation (e.g. mathematical calculations)
  for (let i = 0; i < 1e9; i++) {}
    // setTimeout(()=> {

    // }, 5000)
    return `Processed data:${Date.now()}`;
}