import React from "react";
import ReactDOM from "react-dom"

class BannerTypewriter extends React.Component {

  static defaultProps = {
    dataText: []
  }

  constructor(props) {
    super(props);

    this.state = {
      text: '',
      isDeleting: false,
      loopNum: 0,
      typingSpeed: 150
    }
  }

  componentDidMount() {
    this.handleType();
  }

  handleType = () => {
    const { dataText } = this.props;
    const { isDeleting, loopNum, text, typingSpeed } = this.state;
    const i = loopNum % dataText.length;
    const fullText = dataText[i];

    this.setState({
      text: isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1),
      typingSpeed: isDeleting ? 60 : 150
    });

    if (!isDeleting && text === fullText) {
      
      this.setState({ isDeleting: true });
      
    } else if (isDeleting && text === '') {
      
      this.setState({
        isDeleting: false,
        loopNum: loopNum + 1
      });
      
    }

    setTimeout(this.handleType, typingSpeed);
  };

  render() {    
    return (
      <div className="typewriter">
        <span>&#60;{ this.state.text }<span className="cursor"/> /&#62;</span>
      </div>
    );
    
  }
}


export default BannerTypewriter