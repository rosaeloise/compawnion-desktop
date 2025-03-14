import React from 'react';

import Button from '../components/Button';
import Input from '../components/Input';
import '../css/login.css';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showPassword: false,
		};
	}

	async componentDidMount() {
		const token = localStorage.getItem('token');
		if (token) {
			document.getElementById('loginButton').disabled = true;
			const response = await fetch('https://compawnion-backend.onrender.com/admins/me', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});
			document.getElementById('loginButton').disabled = false;

			if (!response.ok) return;

			window.location.hash = '/dashboard';
		};
	};

	togglePasswordVisibility = () => {
		this.setState(prevState => ({
			showPassword: !prevState.showPassword,
		}));
	};

	handleLogin = () => {
		const usernameElement = document.getElementById('Username');
		const Username = usernameElement.value;
		const passwordElement = document.getElementById('Password');
		const password = passwordElement.value;
		fetch('https://compawnion-backend.onrender.com/admins/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				Username,
				Password: password
			})
		})
			.then(res => res.json())
			.then(response => {
				const token = response.token;
				if (token) {
					localStorage.setItem('token', token);
					window.location.hash = '/dashboard';
				} else {
					MySwal.fire({
						title: <h4>Wrong Credentials</h4>,
						html: <>
							<p>Incorrect Username or Password.</p>
							<p>Please try again.</p>,
						</>,
						width: '60rem',
						icon: 'error',
						iconColor: 'var(--primary-color)',
						confirmButtonText: 'Ok',
						confirmButtonColor: 'var(--primary-color)'
					});
				};
			})
			.catch(err => console.error)
	};
	render() {
		return (
			<>
				<form id='loginForm'>
					<div>
						<svg id='logo' viewBox='0 0 166 59'>
							<path d='M1.04254 30.3404C0.246984 26.6412 0.362431 23.1594 1.38888 19.895C2.44351 16.587 4.23363 13.816 6.75924 11.5819C9.31303 9.30418 12.3857 7.77914 15.9771 7.00676C20.1791 6.10307 24.0921 6.38882 27.716 7.86401C29.456 8.57227 31.0174 9.51813 32.4005 10.7016C34.6826 12.6544 33.2404 16.0323 30.3039 16.6638C28.6465 17.0203 26.9899 16.3099 25.6269 15.3018C24.843 14.7221 23.9874 14.2863 23.0599 13.9944C21.3225 13.4287 19.4302 13.366 17.3831 13.8062C15.1923 14.2774 13.3469 15.2191 11.847 16.6314C10.3753 18 9.35538 19.7223 8.78732 21.7985C8.25518 23.8668 8.25944 26.158 8.80011 28.6721C9.33305 31.1502 10.2711 33.2406 11.6142 34.9432C12.9856 36.6022 14.6272 37.771 16.5392 38.4495C18.4794 39.0844 20.5449 39.1662 22.7357 38.6951C24.7828 38.2548 26.482 37.4197 27.8332 36.1897C28.5558 35.5226 29.1544 34.7583 29.629 33.897C30.4489 32.4092 31.6725 31.0804 33.3333 30.7232C36.2706 30.0915 38.9805 32.5737 37.7173 35.2997C36.9429 36.9708 35.9031 38.4923 34.598 39.864C31.9291 42.6549 28.4757 44.5061 24.2377 45.4175C20.6463 46.1899 17.2222 46.0808 13.9656 45.0903C10.7371 44.0561 7.96604 42.266 5.65242 39.7199C3.37472 37.1661 1.83809 34.0396 1.04254 30.3404Z' fill='var(--primary-complement)' />
							<path d='M69.1198 23.0048C69.0244 25.0598 68.4395 26.9633 67.3652 28.7154C66.3276 30.4692 64.7374 31.848 62.5946 32.8518C60.4885 33.8572 57.8575 34.2867 54.7016 34.1401C51.1448 33.975 48.1275 36.7244 47.9623 40.2813L47.7553 44.7398C47.6564 46.8679 45.8512 48.5128 43.7232 48.414C41.5952 48.3152 39.9502 46.51 40.049 44.382L40.9974 23.9605C41.3602 16.1477 47.9879 10.1082 55.8007 10.471C58.7731 10.6091 61.2813 11.2404 63.3253 12.365C65.3693 13.4896 66.8633 14.9749 67.8073 16.8207C68.7879 18.6683 69.2255 20.7296 69.1198 23.0048ZM54.6602 27.9048C56.7886 28.0036 58.3887 27.5998 59.4605 26.6934C60.534 25.7504 61.1116 24.3981 61.1934 22.6367C61.3672 18.8937 59.3625 16.925 55.1791 16.7307L54.6562 16.7065C51.5705 16.5632 48.953 18.9484 48.8097 22.034C48.6664 25.1196 51.0516 27.7372 54.1373 27.8805L54.6602 27.9048Z' fill='var(--primary-complement)' />
							<path d='M116.111 9.29056C118.712 9.43961 120.454 12.0295 119.61 14.4949L109.822 43.1036C108.959 45.627 106.52 47.2666 103.858 47.114V47.114C101.163 46.9596 98.9099 45.0086 98.3723 42.3631L98.3143 42.0778C97.0282 35.7491 88.1991 35.1934 86.1296 41.3109L85.975 41.7679C85.1267 44.2756 82.7151 45.9139 80.0713 45.7786V45.7786C77.3871 45.6412 75.1331 43.7109 74.5846 41.0797L68.4224 11.5177C67.8947 8.98624 69.9133 6.64377 72.4949 6.79168V6.79168C74.3275 6.89667 75.8433 8.25612 76.1465 10.0665L76.4541 11.9031C77.5368 18.3683 86.5668 19.0356 88.5881 12.7999L88.89 11.8686C89.6658 9.4754 91.9583 7.9068 94.47 8.05069V8.05069C97.0075 8.19608 99.1196 10.0515 99.5907 12.5491L99.7166 13.2166C100.911 19.5492 109.817 19.9811 111.619 13.7938L112.106 12.1201C112.619 10.3592 114.28 9.18566 116.111 9.29056V9.29056Z' fill='var(--primary-complement)' />
							<path d='M159.769 39.6063C160.204 41.1944 160.12 43.0053 159.693 44.616C158.717 48.3034 154.427 50.6665 150.871 49.2874C149.2 48.6393 147.724 47.6998 145.629 48.2729C141.66 49.3589 143.812 52.4803 137.537 55.3102C134.874 56.3132 127.739 52.7229 126.631 48.6723C124.127 39.5214 128.257 26.1512 137.408 23.6477C146.559 21.1442 157.266 30.4554 159.769 39.6063Z' fill='var(--primary-color)' />
							<path d='M127.215 23.3964C128.794 26.1092 128.234 29.0371 126.794 29.8756C125.085 30.8701 122.109 30.0353 120.53 27.3225C120.447 27.181 120.369 27.0353 120.295 26.886C117.954 22.1773 124.569 18.8522 127.215 23.3964Z' fill='var(--primary-color)' />
							<path d='M143.587 35.9744C146.416 38.6969 146.745 42.4112 145.3 43.9134C143.586 45.6949 139.719 45.7102 136.889 42.9877C136.742 42.8457 136.598 42.6973 136.457 42.5431C132.029 37.6802 138.847 31.4141 143.587 35.9744Z' fill='var(--primary-complement)' />
							<path d='M135.107 15.2769C136.276 18.1902 136.564 21.2111 134.729 21.9471C132.895 22.6831 130.46 20.918 129.291 18.0047C128.122 15.0913 129.001 13.2856 130.836 12.5495C132.67 11.8135 133.938 12.3635 135.107 15.2769Z' fill='var(--primary-color)' />
							<path d='M146.274 14.8704C146.203 18.0087 144.544 20.5165 142.568 20.4717C140.592 20.4268 139.47 18.7622 139.541 15.6239C139.571 14.319 140.407 13.2568 140.809 12.1231C141.374 10.5302 141.671 9.08058 142.826 9.10676C144.802 9.15159 146.346 11.732 146.274 14.8704Z' fill='var(--primary-color)' />
							<path d='M155.689 19.5488C155.676 19.6654 155.661 19.7772 155.644 19.8846C155.285 22.1037 153.742 25.0519 151.507 24.8047C149.543 24.5874 148.23 21.8819 148.575 18.7618C148.92 15.6417 150.793 13.2885 152.757 13.5058C154.722 13.7231 156.035 16.4287 155.689 19.5488Z' fill='var(--primary-color)' />
							<path d='M139.112 37.1071C139.138 36.6909 139.188 36.321 139.263 35.9829C139.793 33.5917 141.228 31.0066 143.523 30.1507C143.736 30.0713 143.962 30.0342 144.207 30.0497C146.763 30.2119 148.626 33.6346 148.369 37.6945C148.111 41.7544 145.83 44.9141 143.274 44.7519C140.718 44.5897 138.854 41.167 139.112 37.1071Z' fill='var(--primary-complement)' />
						</svg>

						<h5>Admin Login</h5>
					</div>

					<div id='formGroup'>
						<Input
							placeholder='Username'
							type='text'
							id='Username'
							name='Username'
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									const passwordElement = document.getElementById('Password');
									passwordElement.focus();
								};
							}}
						/>
						<div id='passwordWrapper'>
							<Input
								type={this.state.showPassword ? 'text' : 'password'}
								placeholder='Password'
								id='Password'
								name='Password'
								onKeyDown={(e) => {
								if (e.key === 'Enter') {
									this.handleLogin();
								};
							}}
							/>
							<button
								type="button"
								id="togglePasswordVisibility"
								onClick={this.togglePasswordVisibility}
								aria-label={
									this.state.showPassword ? 'Hide password' : 'Show password'
								}
							>
								{this.state.showPassword ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>

					<Button
						id='loginButton'
						type='button'
						theme='dark'
						onClick={() => {
							this.handleLogin();
						}}
					>Login</Button>

					<svg viewBox='0 0 943 1015' id='pawBackground'>
						<path d='M891.353 638.114C912.994 717.216 873.044 822.788 821.273 834.888C715.504 887.059 679.07 796.346 596.209 819.016C513.348 841.685 558.279 906.839 427.292 965.908C371.714 986.843 222.774 911.903 199.642 827.353C147.385 636.342 233.595 357.26 424.606 305.003C615.617 252.746 839.096 447.103 891.353 638.114Z' fill='var(--primary-color)' />
						<path d='M211.833 299.759C244.803 356.384 233.101 417.499 203.039 435.003C167.386 455.762 105.26 438.336 72.2897 381.71C39.3196 325.085 37.4866 235.727 73.1397 214.969C115.391 218.334 178.863 243.133 211.833 299.759Z' fill='var(--primary-color)' />
						<path d='M376.557 130.274C400.958 191.086 406.97 254.141 368.681 269.505C330.393 284.868 279.573 248.025 255.172 187.213C230.771 126.401 249.12 88.7089 287.409 73.3455C325.698 57.9821 352.157 69.4627 376.557 130.274Z' fill='var(--primary-color)' />
						<path d='M609.673 121.791C608.187 187.298 573.546 239.645 532.3 238.709C491.055 237.773 467.636 203.027 469.122 137.519C469.74 110.282 487.205 88.1102 495.598 64.4464C507.391 31.1959 513.585 0.937857 537.682 1.48447C578.927 2.4201 611.159 56.2831 609.673 121.791Z' fill='var(--primary-color)' />
						<path d='M806.197 219.445C802.778 250.355 791.964 264.909 770.688 286.219C754.55 307.998 740.449 331.539 718.905 329.156C677.899 324.62 650.497 268.146 657.701 203.019C664.905 137.892 703.987 88.7728 744.993 93.3088C785.999 97.8447 813.401 154.318 806.197 219.445Z' fill='var(--primary-color)' />
					</svg>

					<p id='support'><a href='https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=barkcodecompawnion@gmail.com&su=Compawnion%20Admin%20Support' target="_blank">Contact Support</a></p>
				</form>
			</>
		)
	};
};

export default Login;