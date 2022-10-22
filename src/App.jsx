import { useState } from "react";
import "./app.css";
import FormInput from "./components/FormInput";
import "./components/formInput.css"
import { Country, State, City } from 'country-state-city';
import axios from "axios";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


function Select({ options, value, title, handleSelectChange }) {
  return (
    <select required name={title} value={value ? value : ''} onChange={handleSelectChange} >
      <option value="" disabled hidden>Select {title.charAt(0).toUpperCase() + title.slice(1)}</option>
      {options.map(option =>
        <option key={option.isoCode} value={option.isoCode}  >
          {option.name}
        </option>
      )}
    </select>
  )
}

const App = () => {

  const [status, setStatus] = useState('');

  const [phone, setPhone] = useState('');

  const [inputValue, setInputValue] = useState({
    name: "",
    email: "",
    mobileno: "",
    password: "",
    confirmPassword: "",
  });

  const inputs = [
    {
      id: 1,
      name: "name",
      type: "text",
      placeholder: "Name",
      errorMessage:
        "Name should be 3-20 characters and shouldn't include any special character!",
      label: "Name",
      pattern: "^[A-Za-z0-9\\s]{3,25}$",
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "It should be a valid email address!",
      label: "Email",
      required: true,
    },
    // {
    //   id: 3,
    //   name: "mobileno",
    //   type: "tel",
    //   placeholder: "Mobile No.",
    //   label: "Mobile No",
    // },
    {
      id: 3,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Password",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required: true,
    },
    {
      id: 4,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      errorMessage: "Passwords don't match!",
      label: "Confirm Password",
      pattern: inputValue.password,
      required: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitted");
      delete inputValue.confirmPassword
      console.log(inputValue);
      const res = await axios.post("http://localhost:8000/api/adduser", inputValue);
      console.log(res)
      if (res.status === 200) {
        setStatus("Registered successfully");
        setInputValue({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setSelectedCountryId(null);
        setSelectedStateId(null);
        setSelectedCityId(null);
        setPhone(null)
        console.log("Registered successfully")
      }
    } catch (e) {
      if (e.response.status === 422) {
        console.log("user already exist")
        setStatus("User already exist"); return
      }
      setStatus("Something went wrong")
      console.log("Post request failed", e)
    }

  };

  const onChange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);

  const handleCountryChange = (e) => {
    setSelectedStateId(null);
    console.log(e.target)
    setInputValue({ ...inputValue, [e.target.name]: e.target.selectedOptions[0].outerText })

    console.log({ [e.target.name]: e.target.selectedOptions[0].outerText });
    setSelectedCountryId(e.target.value);
  }

  const handleStateChange = (e) => {
    console.log(e.target.value);
    setInputValue({ ...inputValue, [e.target.name]: e.target.selectedOptions[0].outerText })
    console.log({ [e.target.name]: e.target.value });

    setSelectedCityId(null);
    setSelectedStateId(e.target.value);
  }

  const handlePhoneInput = (value) => {
    setPhone(value)
    setInputValue({ ...inputValue, ["mobileno"]: value })
  }

  const handleCityChange = (e) => {
    console.log(e.target.value);
    setInputValue({ ...inputValue, [e.target.name]: e.target.selectedOptions[0].outerText })

    console.log({ [e.target.name]: e.target.value });
    setSelectedCityId(e.target.value);
  }
  const countries = Country.getAllCountries();
  const states = State.getAllStates();
  const cities = City.getAllCities();

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={inputValue[input.name]}
            onChange={onChange}
          />
        ))}
        <label>Mobile No.</label>
        <PhoneInput
          placeholder="Enter phone number"
          name="mobileno"
          value={phone}
          international
          onChange={handlePhoneInput}
        />
        <div className="dropdown">
          <label>Country</label>
          <Select
            name="country"
            options={countries}
            value={selectedCountryId}
            title='country'
            handleSelectChange={handleCountryChange}
          />
          <label>State</label>
          <Select
            name="state"
            options={states.filter(state =>
              state.countryCode === selectedCountryId)}
            value={selectedStateId}
            title='state'
            handleSelectChange={handleStateChange}
          />
          <label>City</label>
          <Select
            name="city"
            options={cities.filter(city =>
              city.stateCode === selectedStateId)}
            value={selectedCityId}
            title='city'
            handleSelectChange={handleCityChange}
          />
        </div>
        <button>Submit</button>
        <div style={{ color: "blue", textAlign: "center", marginTop: "-21px", marginBottom: "20px" }}>{status}</div>
      </form>
    </div>
  );
};

export default App;
