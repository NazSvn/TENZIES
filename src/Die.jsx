import PropTypes from 'prop-types';
import './App.css'

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? '#59E391' : '#e7e7e7'
  }
  const Dots = () => <span className="dot" />

  const Dot = ({value}) => {
    let pips = Number.isInteger(value)
		? Array(value)
				.fill(0)
				.map((_, i) => <Dots key={i} />)
		: null;
	return pips
    
  }

  return(
    <>
      <div className='die-button' style={styles}
        onClick={props.onClick}
      >
        <Dot value={props.value} />       
      </div>    
    </>
  )
}

Die.propTypes  = {
  isHeld: PropTypes.bool,
  onClick: PropTypes.func,
  value: PropTypes.number,
};
 