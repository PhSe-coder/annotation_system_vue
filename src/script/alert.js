import Vue from 'vue'
import alert from "../components/alert";

export function createAlert(props) {
  const alertPlugin = new Vue(
    {
      render: h => h(alert, {props})
    }
  ).$mount()
  document.body.appendChild(alertPlugin.$el)
  return alertPlugin
}

