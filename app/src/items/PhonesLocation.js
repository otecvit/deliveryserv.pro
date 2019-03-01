import React, { Component, Fragment } from 'react'
import { Input, Row, Col, Button, Icon, Form } from 'antd'
import { connect } from 'react-redux'

const generateKey = (pre) => {
    return `${ new Date().getTime() }`;
  }

class PhonesLocation extends Component {

    state = {
          chPhoneLocation: this.props.arrPhones,
    }
    
    componentWillReceiveProps(nextProps) {
      if(nextProps.arrPhones !== this.props.arrPhones) {
        // Изменение массива при выборе иного адреса
        this.setState({
          chPhoneLocation: nextProps.arrPhones
        });
      } 
    }

    // Добавление нового поля с вводом телефона
    addPhone = () => {
      const { chPhoneLocation } = this.state;
      const arrPhone = { 
        iPhone: generateKey(), 
        chPhone: "" 
      };
      const updatedArrPhone = [...chPhoneLocation, arrPhone];

      this.setState({
        chPhoneLocation: updatedArrPhone
      }, this.updateParrent(updatedArrPhone));       
    }

    // Удаление поля с номером телефона
    delPhone = ({target}) => {
        const { chPhoneLocation } = this.state;
        const iPhone = target.getAttribute('data-item');
        const updatedArrPhone = chPhoneLocation.filter(a => a.iPhone !== iPhone);
        this.setState({
          chPhoneLocation: updatedArrPhone,
        }, this.updateParrent(updatedArrPhone));
    }

    // Обработка ввода номера и добавление в state
    handleChange = ({target}) => {
      const { chPhoneLocation } = this.state;
      const iPhone = target.getAttribute('data-item');
      const arrPhone = { 
        iPhone: iPhone, 
        chPhone: target.value 
      };
      const updatedArrPhone = chPhoneLocation.map(item => item.iPhone === iPhone ?  arrPhone : item);

      this.setState({
        chPhoneLocation: updatedArrPhone
      }, this.updateParrent(updatedArrPhone))
      
    }

    // Вызываем callback функцию родителя
    updateParrent = (updatedArrPhone) => {
      this.props.updateData(updatedArrPhone)
    }

    render() {
        const { chPhoneLocation } = this.state;
        
        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });

        const phonesLocation = chPhoneLocation.map( (item, index, arr) => {
            return (
              <Row gutter={4} key={item.iPhone} style={{ marginBottom: 8  }}>
                <Col span={7} >
                  <Input value={item.chPhone} prefix={<IconFont type="icon-phone" style={{ color: 'rgba(0,0,0,.25)' }}/>} data-item={item.iPhone} onChange={this.handleChange}/>
                </Col>
                <Col span={1} style={{ marginTop: 4  }}>
                  { arr.length - 1 === index ? <Button type="default" shape="circle" icon="plus" size="small" onClick={this.addPhone}/> :
                    <Button type="default" shape="circle" icon="minus" size="small" data-item={item.iPhone} onClick={this.delPhone}/> }
                </Col>
              </Row>);
        });

        return (
        <Fragment>
            {phonesLocation}
        </Fragment>
        );
    }
}

export default connect (
    state => ({
        optionapp: state.optionapp,
    }),
  )(PhonesLocation);