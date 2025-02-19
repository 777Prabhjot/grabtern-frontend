import React, { useState } from "react";
import axios from "axios";
import { encryptData, decryptData } from "../../hook/encryptDecrypt";
function Profile({ mentorDetail }) {
  const initialFormData = {
    name: mentorDetail?.name || "", // Make sure to handle null/undefined case
    username: mentorDetail?.username || "",
    email: mentorDetail?.email || "",
    mobile: mentorDetail?.mobile || "",
    internAt: mentorDetail?.internAt || "",
    currentStatus: mentorDetail?.currentStatus || "",
    social: {
      linkedin: mentorDetail?.social?.linkedin || "",
      twitter: mentorDetail?.social?.twitter || "",
    },
    description: mentorDetail?.description || "",
    mentorImg: mentorDetail?.mentorImg || "",
    bookSession: mentorDetail?.bookSession || [],
  };

  const [formData, setFormData] = useState(initialFormData);
  // const [formData, setFormData] = useState(mentorDetail);
  const [msg, setMsg] = useState("");
  const [step, setStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const nextStep = () => {
    setError("");
    setStep((val) => val + 1);
  };
  const previousStep = () => {
    setError("");
    setStep((val) => val - 1);
  };
  const handleSocialChange = (e) => {
    setFormData({
      ...formData,
      social: { ...formData.social, [e.target.name]: e.target.value },
    });
  };

  const handleUploadImageChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setFormData({ ...formData, mentorImg: base64 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formDataCopy = { ...formData }; // Create a copy of the formData to work with
      delete formDataCopy._id;
      delete formDataCopy.password;
      delete formDataCopy.confirmPassword;
      delete formDataCopy.verified;
      delete formDataCopy.token;
      delete formDataCopy.mentorToken;
      delete formDataCopy.setupPWId;
      delete formDataCopy.__v;

      // Make the API call to update the mentor data
      const url = `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/api/mentors/updateMentor/${
        JSON.parse(decryptData("mentorData")).mentorToken
      }`;

      const { data: res } = await axios.post(url, formDataCopy); // Send the updated data to the backend

      alert(res); // Display the response message from the backend

      setModalOpen(false);
      setMsg("Changes saved successfully."); // Set success message
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while saving changes.");
      }
    }
  };
  return (
    <div className="mentorDetail">
      <div style={{ marginLeft: "250px" }}>
        <div
          className="modalPopupAfterRegistrationDone"
          style={{
            alignItems: "flex-start",
            maxWidth: "800px",
            width: "100%",
            marginTop: "-100px",
            maxHeight: "80rem",
          }}
        >
          <h2
            style={{
              marginBottom: "-100px",
              lineHeight: "0",
              fontWeight: "600",
              fontSize: "32px",
              textAlign: "center",
              marginLeft: "230px",
              alignItems: "center",
              marginTop: "5px",
              color: "#64748b",
              fontFamily: "sans-serif",
            }}
          >
            Edit your profile
          </h2>
          <form className="mentorFormEdit" onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <div
                  style={{ gridColumn: "1/3", marginLeft: "500" }}
                  className="mentorUploudPhotoEdit"
                >
                  <img
                    style={{
                      marginTop: "120px",
                      borderRadius: "50%",
                      objectFit: "contain",
                      width: "100px",
                      height: "100px",
                      boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px ",
                    }}
                    src={formData.mentorImg}
                    className="mentorPhoto"
                  />
                  <div>
                    <input
                      style={{ marginTop: "150px", width: "110px" }}
                      type="file"
                      name="mentorProfile"
                      onChange={(e) => handleUploadImageChange(e)}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    <label for="name">NAME</label>

                    <input
                      type="text"
                      name="name"
                      style={{
                        width: "90%",
                        borderRadius: "5px",
                        border: "none",
                        border: "2px solid rgb(220, 220, 220)",
                      }}
                      className="mentorFormInput"
                      onChange={(e) => handleChange(e)}
                      placeholder={mentorDetail?.name}
                      value={formData.name}
                    />
                  </div>
                  <div>
                    <label for="username">USERNAME</label>

                    <input
                      type="text"
                      name="username"
                      style={{
                        width: "90%",
                        borderRadius: "5px",
                        border: "none",
                        border: "2px solid rgb(220, 220, 220)",
                      }}
                      className="mentorFormInput"
                      onChange={(e) => handleChange(e)}
                      placeholder={mentorDetail?.username}
                      value={formData.username}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    <label for="email">EMAIL</label>

                    <input
                      type="email"
                      name="email"
                      className="mentorFormInput"
                      onChange={(e) => handleChange(e)}
                      style={{
                        width: "90%",
                        borderRadius: "5px",
                        border: "none",
                        border: "2px solid rgb(220, 220, 220)",
                      }}
                      // placeholder="e.g. peterparker4321#gmail.com"
                      placeholder={mentorDetail?.email}
                      // readOnly
                      value={formData.email}
                    />
                  </div>
                  <div>
                    <label for="mobile">PHONE</label>

                    <input
                      type="number"
                      name="mobile"
                      className="mentorFormInput"
                      onChange={(e) => handleChange(e)}
                      style={{
                        width: "90%",
                        borderRadius: "5px",
                        border: "none",
                        border: "2px solid rgb(220, 220, 220)",
                      }}
                      // placeholder="0123456789"
                      placeholder={mentorDetail?.mobile}
                      value={formData.mobile}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div>
                    <label for="linkedin">LINKEDIN</label>

                    <input
                      type="text"
                      name="linkedin"
                      className="mentorFormInput"
                      onChange={(e) => handleSocialChange(e)}
                      style={{
                        width: "90%",
                        borderRadius: "5px",
                        border: "none",
                        border: "2px solid rgb(220, 220, 220)",
                      }}
                      // placeholder="e.g. https://www.linkedin.com/peterparker"
                      placeholder={mentorDetail?.linkedin}
                      value={formData.social.linkedin}
                    />
                  </div>
                  <div>
                    <label for="twitter">TWITTER</label>

                    <input
                      type="text"
                      name="twitter"
                      className="mentorFormInput"
                      onChange={(e) => handleSocialChange(e)}
                      style={{
                        width: "90%",
                        borderRadius: "5px",
                        border: "none",
                        border: "2px solid rgb(220, 220, 220)",
                      }}
                      // placeholder="e.g. https://www.twitter.com/peterparker"
                      placeholder={mentorDetail?.twitter}
                      value={formData.social.twitter}
                    />
                  </div>
                </div>

                <div>
                  <label for="description">DESCRIPTION</label>

                  <textarea
                    cols="10"
                    rows="7"
                    name="description"
                    style={{
                      width: "95%",
                      borderRadius: "5px",
                      border: "2px solid rgb(220, 220, 220)",
                    }}
                    className="mentorFormInput"
                    onChange={(e) => handleChange(e)}
                    // placeholder="I've done my Bacherlor's from IIT Delhi. I have been working as SDE-I for past 1 years at microsoft..."
                    placeholder={mentorDetail?.description}
                    value={formData.description}
                  />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  ></div>
                </div>
                {error && (
                  <div style={{ color: "red", gridColumn: "1/3" }}>{error}</div>
                )}
                <hr
                  style={{
                    margin: "10px 0",
                    borderColor: "grey",
                    gridColumn: "1/3",
                  }}
                />
                {msg && (
                  <div style={{ color: "green", gridColumn: "1/3" }}>{msg}</div>
                )}
                <button
                  style={{
                    color: "white",
                    width: "fit-content",
                    padding: "15px 25px",
                    backgroundColor: "#845ec2",
                    cursor: "pointer",
                    marginTop: "-50px",
                    marginLeft: "5px",
                    boxShadow: "6px 4px 13px -2px rgba(0, 0, 0, 0.2)",
                    "&:hover": {
                      backgroundColor: "#6b21a8",
                    },
                  }}
                  type="submit"
                  className="mentorFormButotn"
                  onClick={handleSubmit} // Call the handleSubmit function when the button is clicked
                >
                  Save changes
                </button>
              </>
            ) : (
              <>{error && <div style={{ color: "red" }}>{error}</div>}</>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
