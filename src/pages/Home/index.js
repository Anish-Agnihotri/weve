import React from 'react';
import TextLoop from "react-text-loop";
import { NavLink } from 'react-router-dom';
import HomeHeader from '../../components/HomeHeader';
import './index.css';

// Landing
// Features
// About Arweave
// CTA Login
// Footer

export default class Home extends React.Component {
	constructor() {
		super();

		this.state = {
			width: 90
		}
	}
	handleLandingScroll = () => {
		let position = window.pageYOffset;
		console.log(position);
		/*if (position > 150) {
			if (this.state.width < 100) {
				this.setState({
					width: 90 + ((position - 150) / 15)
				})
			} 
			else if (this.state.width >= 100) {
				this.setState({
					width: 100
				})
			}
		} else {
			if (this.state.width <= 80) {
				this.setState({
					width: 90
				})
			} else {
				this.setState({
					width: this.state.width + ((position - 150) / 30)
				})
			}
		}*/
		console.log(this.state.width);
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleLandingScroll);
	}
	render() {
		return (
			<div className="home">
				<div>
					<span>Built on Arweave. <a href="https://arweave.org" target="_blank" rel="noopener noreferrer">Find out more.</a></span>
				</div>
				<div>
					<HomeHeader />
					<div className="sizer">
						<div className="landing">
							<div>
								<h1>Email made <br/><TextLoop interval={2000}>
								<span>safer.</span>
								<span>faster.</span>
								<span>better.</span>
								<span>easier.</span>
								<span>quicker.</span>
								<span>permanent.</span>
								</TextLoop>{" "}</h1>
								<p><span className="highlight">Weve</span> lets you communicate with <span className="highlight">safety and security</span>.<br/>Begin <span className="highlight">sending messages</span> with the Arweave blockchain.</p>
								<NavLink to="/login">Get Started</NavLink>
							</div>
							<div>
								
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className="features sizer" style={{width: this.state.width + "vw"}}>
						<span>Test</span>
					</div>
				</div>
			</div>
		);
	}
}
