import React from "react";

type Props = {
    graphRef: any;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    graphData: any;
};
const Search: React.FC<Props> = ({
    graphRef,
    search,
    setSearch,
    graphData,
}) => {
    const nodes = graphData.nodes.map((node: any) =>
        node.nodeName.toLowerCase()
    );

    const handleInput = (e: any) => {
        graphRef.current.refresh();
        setSearch(e.target.value);
    };

    return (
        <div className="mb-3 flex flex-col w-full items-center justify-center">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Search Nodes</h4>
            <input
                id="search"
                type="text"
                className="block w-full px-3 py-2.5 text-sm font-normal rounded-xl transition ease-in-out
               focus:border-cyan-600 focus:outline-none focus:bg-opacity-70 text-slate-500
               bg-white border-slate-400 border-2"
                value={search}
                placeholder="Type query"
                onInput={handleInput}
                list="nodeOptions"
                autoComplete="off"
            />
            <datalist id="nodeOptions">
                {graphData.nodes.map((node: any) => (
                    <option key={node.nodeName}>{node.nodeName}</option>
                ))}
            </datalist>
        </div>
    );
};

export default Search;
