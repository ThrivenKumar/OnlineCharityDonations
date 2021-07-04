import statesandcities from "./India.json";
import "./CitiesList.css";

export const CitiesList = ({ state }) => {
  console.log(state);
  const { cities } = statesandcities;
  return (
    <>
      {state !== "" &&
        cities[state].map((city, index) => {
          return <option key={index}>{city}</option>;
        })}
    </>
  );
};

export const StatesList = () => {
  return (
    <>
      <option></option>
      {statesandcities.states.map((state, index) => {
        return <option key={index}>{state}</option>;
      })}
    </>
  );
};
