import React from 'react';

export class VerticalCardHeader extends React.Component {
	render() {
		const {image} = this.props;
		const style = {
			backgroundImage: 'url(' + image + ')'
		};
		return (
			<>
				<header style={style} id={image} className="card-header">
					<h4 className="card-header--title">News</h4>
				</header>
				<style jsx>{`
                .card-header {
                    height: 150px;
                    width: 100%;
                    padding: 15px;
                    width:100%;
                    background-size:cover;
                    color:#fff;
                }   
                .card-header--title {
                    text-transform: uppercase;
                    margin: 0;
                }
                

                `}
				</style>
			</>
		);
	}
}

export class VerticalCardBody extends React.Component {
	render() {
		return (
			<div className="card-body">
				<p className="date">09 Avril 2020</p>

				<h2>{this.props.title}</h2>

				<p className="body-content">{this.props.text}</p>
				<style jsx>{`
                .card-body {
                    padding: 15px;
                    background-color:#fff;
                    width:100%;
                }
                .date {
                    font-size: 11px;
                    font-weight: 600;
                    color: grey;
                  }    
                .body-content {
                    padding-bottom: 40px;
                    font-size: 13px;
                    line-height: 1.8;
                }
                `}
				</style>
			</div>
		);
	}
}

export class VerticalCard extends React.Component {
	render() {
		return (
			<article className="card">
				<VerticalCardHeader image="https://source.unsplash.com/user/erondu/600x400"/>
				<VerticalCardBody title="What happened in my head ?" text="Zombies zombies zombies I am a zombie"/>
				<style jsx>{`
                .card {
                    width:280px;
                    display: block;
                    margin: 30px auto;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
                }
                
                .card:hover {
                    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                    cursor: pointer;
                }
            `}
				</style>
			</article>
		);
	}
}

export class HorizontalCardHeader extends React.Component {
	render() {
		const {image} = this.props;
		const style = {
			backgroundImage: 'url(' + image + ')',
			backgroundSize: 'cover'
		};
		return (
			<>
				<header style={style} id={image} className="card-header">
					<h4 className="card-header--title">News</h4>
				</header>
				<style jsx>{`
            .card-header {
                width: 100%;
                padding: 15px;
                width:100%;
                background-size:cover;
                color:#fff;
            }   
            .card-header--title {
                text-transform: uppercase;
                margin: 0;
            }
            

            `}
				</style>
			</>
		);
	}
}

export class HorizontalCardBody extends React.Component {
	render() {
		return (
			<div className="card-body">
				<p className="date">09 Avril 2020</p>

				<h2>{this.props.title}</h2>

				<p className="body-content">{this.props.text}</p>
				<style jsx>{`
            .card-body {
                padding: 15px;
                background-color:#fff;
                width:100%;
            }
            .date {
                font-size: 11px;
                font-weight: 600;
                color: grey;
              }    
            .body-content {
                padding-bottom: 40px;
                font-size: 13px;
                line-height: 1.8;
            }
            `}
				</style>
			</div>
		);
	}
}

export class HorizontalCard extends React.Component {
	render() {
		return (
			<article className="card">
				<HorizontalCardHeader image="https://source.unsplash.com/user/erondu/600x400"/>
				<HorizontalCardBody title="What happened in my head ?" text="Zombies zombies zombies I am a zombie"/>
				<style jsx>{`
            .card {
                height: 200px;
                width: 550px;
                display: flex;
                margin: 30px auto;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                transition: all 0.3s cubic-bezier(.25,.8,.25,1);
            }
            
            .card:hover {
                box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                cursor: pointer;
            }
        `}
				</style>
			</article>
		);
	}
}

export class ImageLessCardBody extends React.Component {
	render() {
		return (
			<div className="card-body">
				<p className="date">09 Avril 2020</p>

				<h2>{this.props.title}</h2>

				<p className="body-content">{this.props.text}</p>
				<style jsx>{`
            .card-body {
                padding: 15px;
                background-color:#fff;
                width:100%;
            }
            .date {
                font-size: 11px;
                font-weight: 600;
                color: grey;
              }    
            .body-content {
                padding-bottom: 40px;
                font-size: 13px;
                line-height: 1.8;
            }
            `}
				</style>
			</div>
		);
	}
}

export class ImageLessCard extends React.Component {
	render() {
		return (
			<article className="card">
				<ImageLessCardBody title="What happened in my head ?" text="Zombies zombies zombies I am a zombie et ça peut même être plus long hein. Crudelitati pars extorres suis querelas voluntatem damnabantur nebulas aliis aestimati querelas perpetratum praeter nebulas quidam et et quidam conlaticia licentia aliis bonorum stipe opulentae quoque necati clarae timebatur clarae voluntatem."/>
				<style jsx>{`
            .card {
                width: 550px;
                display: flex;
                margin: 30px auto;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                transition: all 0.3s cubic-bezier(.25,.8,.25,1);
            }
            
            .card:hover {
                box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                cursor: pointer;
            }
        `}
				</style>
			</article>
		);
	}
}
