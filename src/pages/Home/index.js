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
			</div>
		);
	}
}
