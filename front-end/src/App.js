import "./App.css";
import { useState } from "react";

function App() {
  const [formState, setFormState] = useState({
    name: "",
    city: "",
    year: "",
  });

  const [message, setMessage] = useState("");

  const url = new URL("http://localhost:8080");

  const handleInputChange = (e) =>
    setFormState({ ...formState, [e.target.name]: e.target.value });

  const formInvalid = () => {
    return !(
      formState.city.length >= 2 &&
      formState.year.length === 4 &&
      formState.name.length >= 2
    );
  };

  const PostFetch = async (e) => {
    e.preventDefault();
    if (formInvalid()) {
      setMessage(
        "Please fill out the form with a name, 4 digit year, and city"
      );
      return;
    }

    const result = await fetch(url, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formState.name,
        city: formState.city,
        year: formState.year,
      }),
    });

    setMessage(makeResultMessage(result));
  };

  const makeResultMessage = (result) => {
    let message = "";
    switch (result?.status) {
      case 200: {
        message = `Data City: ${result.data.City} Name: ${result.data.Name} Year: ${result.data.Year}`;
        break;
      }
      case 201: {
        message = "successfully saved the data";
        break;
      }
      case 204: {
        message = "Save a record first before retrieving data";
        break;
      }
      case 401: {
        message = "sorry you don't have permission";
        break;
      }
      default: {
        message = `something went wrong!`;
        break;
      }
    }
    return message;
  };

  const handleRetrieve = async (e) => {
    e.preventDefault();
    const result = await fetch(url).then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return res;
      }
    });
    setMessage(makeResultMessage(result));
  };

  return (
    <div
      style={{
        backgroundColor: "#8CA9DC",
        height: "100%",
        width: "100%",
        border: "1px solid #4472c4",
      }}
    >
      <p style={{ textAlign: "center", margin: 0 }}>First Page</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <form style={{ display: "flex", flexDirection: "column" }}>
          <div className="formItem">
            <label htmlFor="name">Name:&nbsp;</label>
            <input
              onChange={(e) => {
                handleInputChange(e);
              }}
              value={formState.name || ""}
              id="name"
              name="name"
            ></input>
          </div>
          <div className="formItem">
            <label htmlFor="city">City:&nbsp;</label>

            <input
              id="city"
              name="city"
              onChange={(e) => {
                handleInputChange(e);
              }}
              value={formState.city || ""}
            ></input>
          </div>
          <div className="formItem">
            <label htmlFor="year">Year of Joining:&nbsp;</label>
            <input
              id="year"
              name="year"
              onChange={(e) => {
                handleInputChange(e);
              }}
              value={formState.year || ""}
            ></input>
          </div>
        </form>
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", color: "white" }}
      >
        <button
          type="button"
          onClick={(e) => {
            PostFetch(e);
          }}
        >
          Save
        </button>
        <button
          onClick={(e) => {
            handleRetrieve(e);
          }}
          type="button"
        >
          Retrieve
        </button>
      </div>
      <h3 style={{ textAlign: "center" }}>Results:</h3>
      <p style={{ textAlign: "center" }}>{message}</p>
    </div>
  );
}

export default App;
