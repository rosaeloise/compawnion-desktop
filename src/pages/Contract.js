import React from 'react';

import '../css/contract.css';

import Button from '../components/Button';

export default class Contract extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			applicant: {
				name: {
					firstName: '',
					middleName: '',
					lastName: '',
				},
				birthdate: '',
				occupation: '',
				address: {
					country: '',
					province: '',
					cityOrMunicipality: '',
					baranggay: '',
					street: '',
					lot: '',
				},
				contact: {
					email: '',
					phoneNumber: '',
					facebook: '',
				}
			},
			petInfo: {
				name: '',
				type: '',
				breed: '',
				age: '',
				size: '',
				weight: '',
				rescueDate: '',
				rescueStory: '',
				medicalHistory: [
					{
						procedure: '',
						date: '',
						notes: '',
					}
				],
				vaccinationHistory: [
					{
						name: '',
						date: '',
						expiry: '',
					}
				]
			}
		};
	};
	componentDidMount() {
		// Setup the canvas to fit the display resolution
		const canvas = document.getElementById("signatureCanvas");
		const ctx = canvas.getContext("2d");

		// Adjust for high-DPI screens for more accurate drawing
		function resizeCanvas() {
			const pixelRatio = window.devicePixelRatio || 1;
			canvas.width = canvas.clientWidth * pixelRatio;
			canvas.height = canvas.clientHeight * pixelRatio;
			ctx.scale(pixelRatio, pixelRatio);
			ctx.lineWidth = 2;
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
		}

		// Resize on page load and whenever the window is resized
		window.addEventListener("resize", resizeCanvas);
		resizeCanvas();

		let isDrawing = false;

		// Start drawing
		function startDrawing(event) {
			isDrawing = true;
			ctx.beginPath();
			const { x, y } = getCoordinates(event);
			ctx.moveTo(x, y);
		}

		// Draw on the canvas
		function draw(event) {
			if (!isDrawing) return;
			const { x, y } = getCoordinates(event);
			ctx.lineTo(x, y);
			ctx.stroke();

			// Disable scroll
			window.addEventListener("touchmove", function (event) {
				event.preventDefault();
			}, { passive: false });
		}

		// Stop drawing
		function stopDrawing() {
			isDrawing = false;

			// Enable scroll
			window.removeEventListener("touchmove", function (event) {
				event.preventDefault();
			}, { passive: false });
		}

		// Get accurate coordinates adjusted for high DPI and touch/mouse events
		function getCoordinates(event) {
			const rect = canvas.getBoundingClientRect();
			const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
			const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;
			return { x, y };
		}

		// Event listeners for mouse and touch events
		canvas.addEventListener("mousedown", startDrawing);
		canvas.addEventListener("mousemove", draw);
		canvas.addEventListener("mouseup", stopDrawing);
		canvas.addEventListener("mouseleave", stopDrawing);

		canvas.addEventListener("touchstart", startDrawing, { passive: true });
		canvas.addEventListener("touchmove", draw, { passive: true });
		canvas.addEventListener("touchend", stopDrawing);
		canvas.addEventListener("touchcancel", stopDrawing);

		// Clear the signature
		document.getElementById("clearSignatureBtn").addEventListener("click", () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		});

		// Generate contract
		document.getElementById("generateContractBtn").addEventListener("click", function () {
			const appId = (() => {
				const path = window.location.hash;
				const id = path.split('/')[path.split('/').length - 1];
				return id.charAt(0).toUpperCase() + id.slice(1);
			})();
			const signatureData = canvas.toDataURL("image/png");

			if (appId) {
				fetch(`https://compawnion-backend.onrender.com/pdfcontract/gencontract/${appId}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ signature: signatureData })
				})
					.then(response => response.ok ? response.blob() : Promise.reject('Failed to generate contract'))
					.then(blob => {
						const url = URL.createObjectURL(blob);
						const link = document.createElement("a");
						link.href = url;
						link.download = `adoption-contract-${appId}.pdf`;
						link.click();
					})
					.catch(error => {
						console.error("Error generating contract:", error);
						alert("An error occurred while generating the contract.");
					});
			}
		});

		this.fetchContent();
	}

	fetchContent() {
		const appId = (() => {
			const path = window.location.hash;
			const id = path.split('/')[path.split('/').length - 1];
			return id.charAt(0).toUpperCase() + id.slice(1);
		})();

		if (appId) {
			fetch(`https://compawnion-backend.onrender.com/pdfcontract/contractInformation/${appId}`)
				.then(response => response.ok ? response.json() : Promise.reject('Failed to fetch data'))
				.then(data => {
					this.setState({
						applicant: {
							name: {
								firstName: data.applicant.firstName,
								middleName: data.applicant.middleName,
								lastName: data.applicant.lastName,
							},
							birthdate: data.applicant.birthdate,
							occupation: data.applicant.occupation,
							address: {
								country: data.applicant.address.country,
								province: data.applicant.address.province,
								cityOrMunicipality: data.applicant.address.cityOrMunicipality,
								baranggay: data.applicant.address.baranggay,
								street: data.applicant.address.street,
								lot: data.applicant.address.lot,
							},
							contact: {
								email: data.applicant.contact.email,
								phoneNumber: data.applicant.contact.phoneNumber,
								facebook: data.applicant.contact.facebook,
							}
						},
						petInfo: {
							name: data.petInfo.name,
							type: data.petInfo.type,
							breed: data.petInfo.breed,
							age: data.petInfo.age,
							size: data.petInfo.size,
							weight: data.petInfo.weight,
							rescueDate: data.petInfo.rescueDate,
							rescueStory: data.petInfo.rescueStory,
							medicalHistory: data.petInfo.medicalHistory,
							vaccinationHistory: data.petInfo.vaccinationHistory
						}
					});
				})
				.catch(error => {
					console.error("Error fetching data:", error);
					alert("An error occurred while fetching data.");
				});
		}
	};


	render() {
		return (
			<div id='contractContainer'>
				<div id='contract'>
					<h3>Compawnion AMS Contract</h3>
					<p>By signing this agreement, the Adopter agrees to the following terms and conditions regarding the adoption of an animal from the Adoption Agency.</p>
					<p>We are placing the following described animal with you for adoption:</p>

					<p>Animal Information:</p>
					<ul>
						<li>Pet Name: {this.state.petInfo.name}</li>
						<li>Type: {this.state.petInfo.type}</li>
						<li>Breed: {this.state.petInfo.breed}</li>
						<li>Age: {this.state.petInfo.age}</li>
						<li>Size: {this.state.petInfo.size}</li>
						<li>Weight: {this.state.petInfo.weight}</li>
					</ul>

					<p>Rescue Details:</p>
					<ul>
						<li>Rescue Date: {this.state.petInfo.rescueDate}</li>
						<li>Rescue Story: {this.state.petInfo.rescueStory}</li>
					</ul>

					<p>Medical History:</p>
					<ul>
						{
							this.state.petInfo.medicalHistory.map((record, index) => (
								<li key={index}>Procedure: {record.procedure}, Date: {record.date}, Notes: {record.notes}</li>
							))
						}
					</ul>
					<p>Vaccination History:</p>
					<ul>
						{
							this.state.petInfo.vaccinationHistory.map((record, index) => (
								<li key={index}>Name: {record.name}, Date: {record.date}, Expiry: {record.expiry}</li>
							))
						}
					</ul>

					<p>TERM CONDITIONS AND AGREEMENT</p>
					<p>I agree that the animal will not be sold, nor given away, or transferred to another individual or organization without prior written consent from the Adoption Agency. The Adopter will not use the animal for breeding purposes.</p>
					<p>I agree if at any point I can no longer care for the animal, I agree to return the animal to the Adoption Agency. Under no circumstances will the animal be abandoned, surrendered to a shelter, or placed in a new home without notifying the Adoption Agency.</p>
					<p>I acknowledge that adopting an animal involves inherent risks, including but not limited to injury, illness, or behavioral issues. The Adoption Agency cannot be held liable for any injury, damage, or loss caused by the adopted animal after the adoption has been finalized. I agree to assume full responsibility for the care and behavior of the adopted animal.</p>
					<p>I must reside in a suitable location that allows for the proper care of the animal, must demonstrate the ability to provide a safe, loving, and appropriate environment for the adopted animal.</p>
					<p>The adopter must be 18 years old and above, if not, should be accompanied by a guardian/older family member.</p>
					<p>I agree to maintain proper identification (such as a collar and RFID tag) for the animal at all times.</p>
					<p>In case the adopter damages the RFID tag, there will be a penalty of 1,500 for replacement.</p>
					<p>The Adopter agrees to make a non-refundable adoption fee of 500 pesos. Your fee includes spay/neuter, RFID tag, and vaccines current to the age of the dog/puppy/cat/kitten. Any vaccines or medical care costs after the adoption are the financial responsibility of the Adopter.</p>
					<p>The Adopter acknowledges that they have read, understood, and agreed to the terms and conditions of the animal adoption process as outlined above</p>

					<p>Adopter's Information</p>
					<ul>
						<li>Full Name: {this.state.applicant.name.firstName} {this.state.applicant.name.middleName} {this.state.applicant.name.lastName}</li>
						<li>Phone Number: {this.state.applicant.contact.phoneNumber}</li>
						<li>Contact Number: {this.state.applicant.contact.email}</li>
						<li>Email Address: {this.state.applicant.contact.email}</li>
					</ul>
				</div>

				<div id='card'>
					<div>
						<h5>Adopter's Signature</h5>
						<p>Please sign below to generate your adoption contract:</p>
						<div id='canvasBg'>
							<canvas id='signatureCanvas'></canvas>
						</div>
						<div className='button-container'>
							<Button id='generateContractBtn' title='Generate Contract' />
							<Button id='clearSignatureBtn' title='Clear Signature' />
						</div>
						<div className='button-container'>
							<Button
								id='backBtn'
								title='Back'
								theme='dark'
								onClick={() => {
									history.back();
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	};
};