import React from "react";
import '../styles/components/loopTypewriter.scss';

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
      typingSpeed: 200,
      showCursor: true
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
      typingSpeed: isDeleting ? 100 : 200
    });

    if (!isDeleting && text === fullText) {
      
      this.setState({ isDeleting: true });
      
    } else if (isDeleting && text === '') {
      
      this.setState({
        isDeleting: false,
        loopNum: loopNum + 1
      });
      
    }

    if (!isDeleting && text === fullText) {
      this.setState({ showCursor: false})
      setTimeout(this.handleType, 2500)
    }
    else {
      this.setState({ showCursor: true })
      setTimeout(this.handleType, typingSpeed);
    }
  };

  render() {    
    return (
      <div className="typewriter">
        <span>&#123; { this.state.text }{}<span className={this.state.showCursor ? "cursor-show" : "cursor-hide"}/> &#125;</span>
      </div>
    );
    
  }
}


export default BannerTypewriter