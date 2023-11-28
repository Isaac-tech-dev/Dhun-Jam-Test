import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";

function Admin() {
  const [chargeCustomers, setChargeCustomers] = useState(null);
  const [songRequestAmount, setSongRequestAmount] = useState("");
  const [additionalAmounts, setAdditionalAmounts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [location, setLocation] = useState("");
  const [name, setname] = useState("");
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);

  const override = css`
    display: block;
    margin: 0 auto;
  `;

  const handleInputChange = (index, newValue) => {
    const updatedAmounts = [...additionalAmounts];
    updatedAmounts[index] = newValue;
    setAdditionalAmounts(updatedAmounts);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://stg.dhunjam.in/account/admin/4");
        const data = await response.json();

        if (response.ok) {
          setUserData(data.data);
          setChargeCustomers(data.data.charge_customers ? "yes" : "no");
          // Assuming you want to set a default value for songRequestAmount, adjust as needed
          setSongRequestAmount(data.data.amount.category_6.toString());
          setLocation(data.data.location);
          setname(data.data.name);
          // Fetch values from additional categories
          const additionalValues = [
            data.data.amount.category_7,
            data.data.amount.category_8,
            data.data.amount.category_9,
            data.data.amount.category_10,
          ];
          setAdditionalAmounts(
            additionalValues.map((value) => value.toString())
          );
          const amounts = [
            data.data.amount.category_6,
            data.data.amount.category_7,
            data.data.amount.category_8,
            data.data.amount.category_9,
            data.data.amount.category_10,
          ];
          // Update chart data
          setChartData({
            labels: [
              "Category 6",
              "Category 7",
              "Category 8",
              "Category 9",
              "Category 10",
            ],
            datasets: [
              {
                label: "Amount",
                backgroundColor: ["#F0C3F1"],
                data: amounts,
              },
            ],
          });
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchUserData();
  }, []); // The empty dependency array ensures the effect runs only once, similar to componentDidMount

  const handleRadioChange = (value) => {
    setChargeCustomers(value);
  };

  const handleAmountChange = (e) => {
    setSongRequestAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch("https://stg.dhunjam.in/account/admin/4", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: {
            category_6: parseInt(songRequestAmount),
          },
        }),
      });
  
      if (response.ok) {
        console.log("Category_6 updated successfully");
        // Optionally, you can fetch the updated data here and update the state
      } else {
        console.error("Failed to update category_6");
      }
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="bg-[#030303] h-screen m-auto p-0 flex justify-center w-full">
      <div className="flex flex-col mt-[40px] items-center w-full">
        <h2 className="text-white">
          {name},{location} on Dhun Jam
        </h2>

        {/* YES/NO */}
        <div className="w-2/5 flex flex-row justify-between items-center mb-4">
          <div>
            <h2 className="text-white px-2">
              Do you want to charge your customer's for requesting Songs?
            </h2>
          </div>

          <div className="flex flex-row">
            <div className="flex flex-row justify-center items-center">
              <label className="text-white px-2">Yes</label>
              <input
                type="radio"
                name="chargeCustomers"
                value="yes"
                checked={chargeCustomers === "yes"}
                onChange={() => handleRadioChange("yes")}
              />
            </div>
            <div className="flex flex-row justify-center items-center">
              <label className="text-white px-2">No</label>
              <input
                type="radio"
                name="chargeCustomers"
                value="no"
                checked={chargeCustomers === "no"}
                onChange={() => handleRadioChange("no")}
              />
            </div>
          </div>
        </div>

        {/* CUSTOM SONG */}
        <div className="w-2/5 flex flex-row justify-between items-center p-2 mb-4">
          <div>
            <h2 className="text-white text-base">
              Custom song request amount
            </h2>
          </div>
          <div>
            <input
              value={songRequestAmount}
              onChange={(e) => setSongRequestAmount(e.target.value)}
              className="bg-transparent border-2 rounded-xl text-white p-2 text-center"
            />
          </div>
        </div>

        {/* REGULAR REQUEST */}
        <div className="w-2/5 flex flex-row justify-between items-center p-2 mb-4">
          <div>
            <h2 className="text-white text-base">
              Regular song request amount, from high to low
            </h2>
          </div>
          <div>
            <div className="flex flex-row">
              {additionalAmounts
                .sort((a, b) => b - a)
                .map((value, index) => (
                  <input
                    key={index}
                    type="text" // You can change the type based on your input requirements
                    value={value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="bg-transparent text-white mx-2 border-2 px-2 py-1 rounded-md w-12"
                  />
                ))}
            </div>
          </div>
        </div>

        {/* GRAPGH */}
        {/* Bar Chart */}
        <div className="w-2/3 p-4">
          {chartData.datasets ? (
            <Bar
              data={chartData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>

        <div className="px-2 py-4 w-[600px] items-center justify-center flex">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-[#6741D9] hover:bg-[#6741D9] hover:border-2 hover:border-[#F0C3F1] text-white font-bold py-2 px-4 rounded w-3/5"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader css={override} size={15} color={"#fff"} />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
