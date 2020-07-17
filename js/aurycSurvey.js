const aurycSurvey = (() => {
    const $overlay = $('<div class="overlay"/>');
    let surveyData = [];

    const ranking = (index, display) => {
        const sTmp = [];

        const componentData = surveyData[index];
        let className = 'ranking';
        if (!display) {
            className += ' hide';
        }
        sTmp.push('<div class="' + className + '">');
            sTmp.push('<div class="label">');
                sTmp.push(componentData.label);
                if (componentData.required && componentData.requiredSymbol) {
                    sTmp.push('<div class="requiredSymbol">' + componentData.requiredSymbol + '</div>')
                }
            sTmp.push('</div>');

            sTmp.push('<div class="rankingEntries">');
                for (let i = 0; i < 11; i++) {
                    const e = "e" + i;
                    sTmp.push('<div class="entry" entryId="' + e + '">' + i + '</div> ')
                    $(".step2").on('click', "." + e, (index, e) => onClickRankingEntry(index, e))
                }
            sTmp.push('</div>');

            if (componentData.leftLabel || componentData.rightData) {
                sTmp.push('<div class="rankingLabels">')
                    if (componentData.leftLabel) {
                        sTmp.push('<div class="leftLabel">' + componentData.leftLabel + '</div>');
                    }
                    if (componentData.rightLabel) {
                        sTmp.push('<div class="rightLabel">' + componentData.rightLabel + '</div>');
                    }
                sTmp.push('</div>')
            }
        sTmp.push('</div>');


        return(sTmp.join(''))
    }

    const multiLineText = (index, display) =>{
        const sTmp = [];

        const componentData = surveyData[index];
        let className = 'multiLineText';
        if (!display) {
            className += ' hide';
        }
        sTmp.push('<div class="' + className + '">');
            sTmp.push('<div class="label">');
                sTmp.push(componentData.label);
                if (componentData.required && componentData.requiredSymbol) {
                    sTmp.push('<div class="requiredSymbol">' + componentData.requiredSymbol + '</div>')
                }
            sTmp.push('</div>');

            let extraAttr = [];
            if (componentData.placeholder) {
                extraAttr.push('placeholder="' + componentData.placeholder + '"');
            }
            sTmp.push('<div class="messageAreaDiv">');
                sTmp.push('<textarea class="messageArea" ' + extraAttr.join(' ') + '></textarea>') 
            sTmp.push('</div>');

            sTmp.push('<div class="messageLengthDiv">');
                sTmp.push('<div class="messageLength">1,000</div>');
                sTmp.push('<div class="messageLengthMsg">chacters left</div>')
            sTmp.push('</div>')
        sTmp.push('</div>');

        return sTmp.join('');
    }

    const dropdown = (index, display) => {
        const sTmp = [];

        const componentData = surveyData[index];
        let className = 'dropdown';
        if (!display) {
            className += ' hide';
        }

        const option = componentData.dropdown.map((entry) => {
            const tmp = `<option value="${entry}">${entry}</option>`

            return tmp;
        })


        sTmp.push('<div class="' + className + '">');
            sTmp.push('<div class="label">');
                sTmp.push(componentData.label);
                if (componentData.required && componentData.requiredSymbol) {
                    sTmp.push('<div class="requiredSymbol">' + componentData.requiredSymbol + '</div>')
                }
            sTmp.push('</div>');

            sTmp.push('<select class="select">');
                sTmp.push(option);
            sTmp.push('</select>');
        sTmp.push('</div>');

        return sTmp.join('');
    }

    const radioButtons = (index, display) => {
        const sTmp = [];

        const componentData = surveyData[index];
        let className = 'radioButtons';
        if (!display) {
            className += ' hide';
        }

        sTmp.push('<div class="' + className + '">');
            sTmp.push('<div class="label">');
                sTmp.push(componentData.label);
                if (componentData.required && componentData.requiredSymbol) {
                    sTmp.push('<div class="requiredSymbol">' + componentData.requiredSymbol + '</div>')
                }
            sTmp.push('</div>');

            let radioLableStyle = 'radioBtnLabel';
            if (componentData.direction === 'vertical') {
                radioLableStyle += ' vertical';
            }
            sTmp.push('<div class="radioBtnDiv">');
                for (let i = 0; i < componentData.buttons.length; i++) {
                    sTmp.push('<input class="radioBtn" type="radio" name="radioBtn' + index + '" value="' + componentData.buttons[i] + '">');
                        sTmp.push('<div class="' + radioLableStyle + '">' + componentData.buttons[i] + '</div>');
                    sTmp.push('</input>');
                }
            sTmp.push('</div>');
        sTmp.push('</div>')

        return sTmp.join('');
    }
    
    const buildSurvey = () => {
        const sTmp = [];

        sTmp.push('<div class="modelDlg surveyDlg">');
            let display = true;
            for (let f = 0; f < surveyData.length; f++) {
                sTmp.push('<div class="step' + f + '">');
                    switch (surveyData[f].type) {
                        case 'header':
                            sTmp.push('<div class="header">' + surveyData[f].label + '</div>')
                            break;
                        case 'requiredMsg':
                            sTmp.push('<div class="required">')
                                sTmp.push('<div class="requiredSymbol">' + surveyData[f].symbol + '</div>');
                                sTmp.push('<div class="label">' + surveyData[f].label + '</div>');
                            sTmp.push('</div>');
                            break;
                        case 'ranking':
                            sTmp.push(ranking(f, display));
                            display = false;
                            break;
                        case 'multiLineText':
                            sTmp.push(multiLineText(f, display));
                            display = false;
                            break;
                        case 'dropdown':
                            sTmp.push(dropdown(f, display));
                            display = false;
                            break;
                        case 'radioButtons':
                            sTmp.push(radioButtons(f, display));
                            display = false;
                            break;
                }
                sTmp.push('</div>');
            }

            sTmp.push('<div class="actionButton">');
                sTmp.push('<button type="button" class="nextSubmitBtn">Next ></button>')
            sTmp.push('</div>');
        sTmp.push('</div>');

        return sTmp.join('');
    }

    const onClickRankingEntry = (dataIndex, step, e) => {
        // clear selected
        $('.rankingEntries .entry', step).removeClass('selected');

        // display the clicked on/selected values
        const entryId = $(e.target).attr('entryId');
        $('.rankingEntries .entry[entryId="' + entryId + '"]', step).addClass('selected');

        // save the selected value
        surveyData[dataIndex].selectedValue = entryId.replace('e', '');

        // enable the next buttom
        $('.nextSubmitBtn').prop("disabled", false);
    }

    const onClickNextSubmit = () => {
        const $btn = $('.nextSubmitBtn');
        const submit = $btn.attr('submit') == 'true';
        const currentStep = parseInt($btn.attr('currentStep'), 10);

        if (submit) {
            $('.overlay').remove();
            $('.modelDlg').remove();

            const values = [];
            for (let f = 0; f < surveyData.length; f++) {
                switch (surveyData[f].type) {
                    case 'ranking':
                        if (surveyData[f].selectedValue) {
                            const tmp = `${surveyData[f].name} => ${surveyData[f].selectedValue}`
                            values.push(tmp);
                        }
                        break;
                    case 'multiLineText':
                        if (surveyData[f].message) {
                            const tmp = `${surveyData[f].name} => ${surveyData[f].message}`
                            values.push(tmp);
                        }
                        break;
                    case 'dropdown':
                        if (surveyData[f].selectedValue) {
                            const tmp = `${surveyData[f].name} => ${surveyData[f].selectedValue}`
                            values.push(tmp);
                        }
                        break;
                    case 'radioButtons':
                        if (surveyData[f].selectedValue) {
                            const tmp = `${surveyData[f].name} => ${surveyData[f].selectedValue}`
                            values.push(tmp);
                        }
                        break;
                }
            }

            alert(values.join('\r\n'))

        }
        else {
            // hide the current step
            const $current = $('.surveyDlg .step' + currentStep).children().eq(0);
            $current.addClass('hide');

            // display the next step
            const $next = $('.surveyDlg .step' + (currentStep + 1)).children().eq(0);
            $next.removeClass('hide');

            if ((currentStep + 1) === (surveyData.length -1)) {
                $btn.html('Submit').attr('submit', true);

            }
            else {
                $btn.html('Next >').attr('submit', false).attr('currentStep', currentStep + 1);
            }
        }
    }

    const onInputMessageArea = (dataIndex, step, e) => {
        const val = $(e.target).val();

        let numLeft = 1000 - val.length;
        if (numLeft == 1000) {
            numLeft = '1,000';
        }
        $('.messageLengthDiv .messageLength', step).text(numLeft);

        surveyData[dataIndex].message = val;
    }

    const onChangeDropdown = (dataIndex, step, e) => {
        const val = $(e.target).val();

        surveyData[dataIndex].selectedValue = val;
    }

    const onChangeRadioButton = (dataIndex, step, e) => {
        const val = $(e.target).attr('value');

        surveyData[dataIndex].selectedValue = val;
    }

    const addHandlers = ($dlg) => {
        let keepFirst = true;
        let required = false;
        let lastStep = false;
        let firstDisplayed = -1;
        for(let f = 0; f < surveyData.length; f++) {
            const step = '.step' + f;
            switch (surveyData[f].type) {
                case 'ranking': 
                    $(step, $dlg).on('click', '.entry', function(e) { onClickRankingEntry(f, step, e)});

                    if (keepFirst) {
                        required = surveyData[f].required;
                        lastStep = f == surveyData.length - 1;
                        firstDisplayed = f;

                        keepFirst = false;
                    }
                    break;
                case 'multiLineText':
                    $(step, $dlg).on('input', '.messageArea', function(e) {onInputMessageArea(f, step, e)})

                    if (keepFirst) {
                        required = surveyData[f].required;
                        lastStep = f == surveyData.length - 1;
                        firstDisplayed = f;

                        keepFirst = false;
                    }
                    break;
                case 'dropdown': 
                    $(step, $dlg).on('change', '.select', function(e) {onChangeDropdown(f, step, e)});

                    if (keepFirst) {
                        required = surveyData[f].required;
                        lastStep = f == surveyData.length - 1;
                        firstDisplayed = f;

                        keepFirst = false;
                    }
                    break;
                case 'radioButtons':
                    $(step, $dlg).on('click', '.radioBtn', function(e) {onChangeRadioButton(f, step, e)});

                    if (keepFirst) {
                        required = surveyData[f].required;
                        lastStep = f == surveyData.length - 1;
                        firstDisplayed = f;

                        keepFirst = false;
                    }
                    break;
            }

        }

        // enable / disable the submit button
        const $btn = $('.nextSubmitBtn');
        $btn.on('click', onClickNextSubmit);
        $btn.attr('currentStep', firstDisplayed);
        if (required) {
            $btn.prop("disabled", true);
        }
        else {
            $btn.prop("disabled", false);
        }

        // set the correct label
        if (lastStep) {
            $btn.html('Submit').attr('submit', true);
        }
        else {
            $btn.html('Next >').attr('submit', false);
        }
    }

    return {
        init: (data) => {
            surveyData = data;
        },

        display: () => {
            // create the overlay
            $overlay.appendTo('body');
            $overlay.css('height', $(document).height() + 'px')
            $overlay.css('width', $(document).width() + 'px')
    
            $(window).on('resize', function() {
                $overlay.css('height', $(document).height() + 'px')
                $overlay.css('width', $(document).width() + 'px')
            });

            $('.overlay').on('click', (e) => {
                $('.overlay').remove();
                $('.modelDlg').remove();
            })

            // dialog
            const sTmp = buildSurvey();
            const $dlg = $(sTmp);
            $dlg.appendTo('body');
            addHandlers($dlg);

        },
    }
})();