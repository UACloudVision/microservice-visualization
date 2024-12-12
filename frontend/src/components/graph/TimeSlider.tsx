import React, { useState } from "react";
import compareChanges from "../../getChanges";
import getData from "../../getData";

//*
// The time slide is what controller which commit is shown on the visualization
// It contains a few key parameters, setGraphTimeline, which can be used to update the commits available to the user
// setGraphData which is used to update the actual data being shown on the graph,
// graphTimeline which is an array of everyting on the timeline. Currently each array element contains the entire dictionary of an IR file
// currentInstance which is the index of the currently selected item on the timeline
// setCurrentInstance is called whenever the timeline is moved
// trackChanges is a toggle in the top right corner of the website which allows you to see the difference between the selected commit and the previous commit. This determines if getChanges() or getData() are called
// 
// */
type Props = {
    max: number;
    setGraphData: any;
    graphTimeline: Array<any>;
    currentInstance: any;
    setCurrentInstance: any;
    setDefNodeColor: any;
    trackChanges: any;
};
const TimeSlider: React.FC<Props> = ({
    max,
    setGraphData,
    graphTimeline,
    currentInstance,
    setCurrentInstance,
    setDefNodeColor,
    trackChanges,
}) => {
    const [value, setValue] = useState(0);

    const handleChange = (e: any) => {
        //Everytime the slide is changed, set the currentInstance and then call either getChanges or getData depending on if the showChanges toggle is true or false
        setValue(e.target.value);
        setCurrentInstance(parseInt(e.target.value));
        if (trackChanges && (e.target.value != 0)) {
            setGraphData(compareChanges(graphTimeline[e.target.value - 1], graphTimeline[e.target.value]))
        } else {
            setGraphData(getData(graphTimeline[e.target.value]));
        }
        
        setDefNodeColor(false);
    };
    return (
        <div className="absolute bottom-4 z-50 flex flex-col gap-2 text-sm bg-blue-300 bg-opacity-60 rounded-lg p-4 w-1/3">
            <div className="bg-white items-center flex flex-col gap-2 rounded-lg p-4 bg-opacity-90">
                <label
                    htmlFor="steps-range"
                    className="block pb-2 text-sm font-medium text-gray-700"
                >
                    Timeline
                </label>
                <input
                    id="steps-range"
                    type="range"
                    min="0"
                    max={graphTimeline.length - 1}
                    value={value}
                    onChange={handleChange}
                    step="1"
                    className="w-full h-2  rounded-lg appearance-none cursor-pointer bg-gray-300"
                />
                <div className="flex flex-col text-xs font-light font-mono w-full">
                    <div className="font-medium text-base font-serif">
                        Iteration {value}
                    </div>
                    <div>
                        Commit #{graphTimeline[currentInstance].commitID}
                    </div>
                    <div>
                        Created {graphTimeline[currentInstance].createDate}
                    </div>
                    <div>
                        Modified {graphTimeline[currentInstance].modifyDate}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeSlider;
