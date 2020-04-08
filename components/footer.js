import Icon from './icon';

export default () => (
	<footer>
		<div className="main-footer">
			<div className="container">
				<div className="row">
					{/* Column 1 */}
					<div className="col">
						<h2>HETIC Newsroom</h2>
						<p>Un collectif indépendant de l’école <strong>HÉTIC</strong>, la Newsroom vous propose de raconter ensemble la vie des héticiens.</p>
					</div>
					<div className="col">
						<h2 className="follow-us">Suivez-nous :</h2>
						<div className="icon">
							<Icon name="twitter" href="#" width="10%" height="10%" fill="#fff"/>
							<Icon name="facebook" href="#" width="10%" height="10%" fill="#fff"/>
							<Icon name="linkedIn" href="#" width="10%" height="10%" fill="#fff"/>
						</div>
					</div>
				</div>
				<p className="copyright">© 2020 HÉTIC Newsroom, tous droits réservés</p>
			</div>
		</div>

		<style jsx>{`
			footer {
				bottom: 0;
				left: 0;
				z-index: 100;
                width: 100%;
				align-items: center;
                background: var(--color-black);
                padding-top: 40px;
			}

            .main-footer{
                margin: 0 auto;
                max-width: 1100px;
                width: 100%;
                padding-left: 15px;

            }

            .col p{
                color:var(--color-white);
            }

            .copyright{
                margin: 0;
                color:var(--color-white);
            }

            .col{
                display: inline-block;
                width: 50%;
            }

            .row{
                display: flex;
            }

												h2 {
                line-height: 1;
                color: var(--color-white)
												}

            .follow-us{
                text-align: center;
            }

            .icon{
                text-align: center;
                margin-top: 30px;
            }

												@media (max-width: 659px) {
																	.row{
                    display: flex;
                    flex-direction: column;
                }

                .row h2{
                    text-align: center;
                }

                .col{
                    width: 100%;
                }

																.icon{
                    margin-bottom: 10px;
                }
                
                .copyright{
                    text-align: center;
                    padding-bottom: 10px;
                }
		`}
		</style>
	</footer>
);
