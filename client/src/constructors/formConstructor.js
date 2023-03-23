import config from "config"
import React from "react"

export function formConstructor(category, formData, onChange) {
  return config.form[category].map((item, index) => {
    let formHTML
    switch (item.type) {
      case "dropdown":
        let dropdownItems = config.form[category][index].optionsArray.map(
          (item, index) => {
            return (
              <option value={item} key={index}>
                {item}
              </option>
            )
          }
        )
        formHTML = (
          <select
            name={item.valueName}
            value={formData[item.valueName]}
            onChange={onChange}
          >
            <option>{item.placeholder}</option>
            {dropdownItems}
          </select>
        )
        break
      case "textBox":
        formHTML = (
          <input
            type="text"
            placeholder={item.placeholder}
            name={item.valueName}
            value={formData[item.valueName]}
            onChange={onChange}
          />
        )
        break
      case "textField":
        formHTML = (
          <textarea
            placeholder={item.placeholder}
            name={item.valueName}
            value={formData[item.valueName]}
            onChange={onChange}
          />
        )
        break
      case "icon":
        return (
          <div className="form-group icon-input">
            <i className={item.icon} />
            <input
              type="text"
              placeholder={item.placeholder}
              name={item.valueName}
              value={formData[item.valueName]}
              onChange={onChange}
            />
          </div>
        )

      default:
        break
    }
    return (
      <div className={"form-group"}>
        {item.icon !== null ? <i className={item.icon} /> : null}
        {formHTML}
        <small className="form-text"> {item.desc} </small>
      </div>
    )
  })
}
