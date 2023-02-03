import { useState } from "react";
import "./App.css";
import { CopyBlock, dracula } from "react-code-blocks";

const API_KEY = '' // get your own api key from app.conciselabs.io


function App() {
  const [contractAddress, setContractAddress] = useState("");
  const [result, setResult] = useState("");
  const [chain, setChain] = useState("ethereum-mainnet");
  const [pageNo, setPageNo] = useState(1);
  const [image, setImage] = useState("");
  const [metadata, setMetadata] = useState("");

  const fetchNFt = async () => {
    let res = await fetch(
      `https://app.conciselabs.io/api/v0/nfts/${chain}/${contractAddress}/all/${API_KEY}?pageNo=${pageNo}`
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
        setResult(err);
      });
    setResult(res);
    setImage("")
    setMetadata("")
  };


  const disNFT = async (idx) => {
    console.log(result[idx]["metadata"]);
    setMetadata(result[idx]["metadata"])
    if (result[idx]["metadata"]["image"]) {
      let url = result[idx]["metadata"]["image"];
      if (url.startsWith("ipfs")) {
        url = `https://gateway.pinata.cloud/ipfs/${url.replace("ipfs://", "")}`;
      }
      setImage(url);
    }
  };
  const handleOnwer = (idx) => {
    return result[`${idx}`]["owner"];
  };

  return (
    <div className="App">
      <h1 className="text-3xl">Fetch NFT Collection</h1>
      <div className="pl-7 ">
        <div className="pt-[10px] flex pr-[34px] flex-col">
          <input
            type="text"
            placeholder="Enter Contract Address"
            onChange={(e) => {
              setContractAddress(e.target.value);
            }}
            value={contractAddress}
            className="bg-bg-[#323131] border border-[#B0B0B0] w-[505px] text-sm rounded-sm p-2.5 dark:bg-[#323131] dark"
          />

          <select
            id=""
            value={chain}
            label="Chain"
            onChange={(e) => {
              setChain(e.target.value);
            }}
            className="bg-bg-[#323131] border border-[#B0B0B0] w-[505px] text-sm rounded-sm p-2.5 dark:bg-[#323131] dark mt-[25px]"
          >
            <option value="ethereum-mainnet">Ethereum Mainnet</option>
            <option value="polygon-mainnet">Polygon Mainnet</option>
            <option value="bsc-mainnet">BSC Mainnet</option>
            <option value="avalanche-mainnet">Avalanche Mainnet</option>
          </select>

          <button
            onClick={fetchNFt}
            className="bg-gradient-to-r from-[#F55151] to-[#FFB800] text-base w-[161px] h-[46px] py-2 px-4 rounded mt-[20px] mb-[20px]"
          >
            Submit
          </button>
        </div>
      </div>
      {result && (
        <div className="text-left">
           <table className="bg-[#323131] text-sm text-left text-white mb-[15px] ml-[15px]">
              <tbody>
                {Object.entries(result).map((key, value) => {
                  const owner = handleOnwer(value);
                  if (!owner) {
                    return null;
                  }
                  return (
                    <tr className="flex items-center " key={key}>
                      <th
                        className="p-6 py-4 font-medium whitespace-nowrap text-white"
                        onClick={() => {
                          disNFT(value);
                        }}
                      >
                        {owner}
                      </th>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          <div className="flex h-full w-[750px] ml-[15px] mb-[10px]">
            {metadata && <CopyBlock
              text={JSON.stringify(metadata, null, 4)}
              language={"json"}
              showLineNumbers={true}
              theme={dracula}
              codeBlock
            />}
            {image && (
            <img
              src={image}
              alt="NFT Image"
              className="h-[500px] ml-[280px] -translate-y-2/3"
            />
          )}
          </div>
          
          {result[5]["previousPage"] && (
            <button
              onClick={() => {
                setPageNo(result[5]["previousPage"]);
                fetchNFt();
              }}
              className="bg-gradient-to-r from-[#F55151] to-[#FFB800] text-base w-[161px] h-[46px] py-2 px-4 rounded mt-[20px] mb-[20px] mr-[25px] ml-[15px]"
            >
              Previous
            </button>
          )}
          {result[5]["nextPage"] && (
            <button
              onClick={() => {
                setPageNo(result[5]["nextPage"]);
                fetchNFt();
              }}
              className="bg-gradient-to-r from-[#F55151] to-[#FFB800] text-base w-[161px] h-[46px] py-2 px-4 rounded mt-[20px] mb-[20px] ml-[15px]"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
