$(document).ready(function () {

    // Modifiable variables 
    var NumTrials = 100;
    var Noise = 1;

    var Condition = 3;
    //Condition     Adviser 1       Adviser 2
    //  1           B & D           Linear 
    //  2           B & D           Random  
    //  3           Linear          Random
    //  4           Linear          OverConfidence
    //  5           B & D           Overconfidence
    //  6           Random          Overconfidence


    var Lin = new Array;
    var Rand = new Array;
    var SideCorrect = new Array;
    var Order = new Array;
    
//    //$.getJSON("Lin6Rand75.json", function(json) {
//    $.getJSON("Lin7Rand7.json", function(json) {
//
//        for (var TrialNums = 0; TrialNums < NumTrials; TrialNums++) {
//            
//            Lin[TrialNums] = json.Lin[TrialNums];
//            Rand[TrialNums] = json.Rand[TrialNums];
//            SideCorrect[TrialNums] = json.SideCorrect[TrialNums];
//            // Order.push(TrialNums);  
//            Order[TrialNums] = TrialNums;
//        }
//        ;
//     
//        Order=Shuffle(Order);
//        //console.log(Order);
//    });
    
    
    var BD_function = [1, 1, 2, 2, 3, 8, 9, 9, 10, 10]; // what BD adviser uses to  advice
    var Li_function = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // what Linear adviser uses to advise

    // Duration for showing advice and the outcome page 
    var TimeShowadvice = 1000;
    var TimeOutcome = 10; 


    SubID = CreateCode();

    // Constant variables
    var PreviousResponse = 1; //we can chose first Advice randomly then use the real response, 1 or 2 refering to advisor one or two 
    // empty variable to be used
    var CurrentResponse = 1;
    var Advice1 = 0;
    var Advice2 = 0;
    var AdvisorOutcome = 0;
    var AdvisorChosen = [];
    var BW_Degree = [];

    var ThisResponse = 0;

    var L = 0;
    var LL = 0;
    var B = 0;
    var BB = 0;
    var R = 0;
    var RR = 0;
    var O = 0;
    var OO = 0;

    var SumReward = 0;
    var CoinLocation = (0);
    var SumReward = 0;

    var RandPosition = []; // array of random 0-1 for changind the position of advisors 
    for (var i = 0; i < NumTrials; i++) {
        RandPosition.push(Math.round(Math.random()));
    }

    //   creating BD_Degree purely random 
    //for (var i = 0, t = 9; i < NumTrials; i++) {
    //   BW_Degree.push(Math.min(Math.round(Math.random() * t) + 1),10);
    //  }
    // Shuffle array
    function shuffle(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
            ;
        return o;
    }

    // creating participants code
    function CreateCode() {
        return Math.floor(Math.random() * 10000000000);
    }
    ;


    // The Linear Advisor functions 
    function Li_Adviser(Degree, Response) {
        var RandomNum = Math.floor((Math.random() * (Noise * 2+1)) - Noise);
        LL = Math.max(1,Math.min(10,Degree+RandomNum));
                

        // LL = 0;
        //  while (LL > 10 || LL <= 0) {
        //     LL = Degree + (Math.floor((Math.random() * (Noise * 2))) - Noise);
        //  }
        //  ;
        L = Li_function[LL - 1];
        // console.log("LL : " + LL + " L : " + L);
        return L;
    }
    ;

    // The B & D adviser, Noise introduced then adviser functions applied 
    function BD_Adviser(Degree, Response) {
        var RandomNum = Math.floor((Math.random() * (Noise * 2+1)) - Noise);
        BB = Math.max(1,Math.min(10,Degree+RandomNum));
        
        
        //BB = 0;
        //  while (BB > 10 || BB <= 0) {
        //     BB = Degree + (Math.floor((Math.random() * (Noise * 2))) - Noise);
        // }
        //  ;
        if (Response === 2)
        {
            B = BD_function[BB - 1];
        }
        else
        {
            B = Li_Adviser(Degree, Response);
        }
        //console.log("BB : " + BB + " B : " + B);
        return B;
    }
    ;

    function Ra_Adviser(Degree, Response) {
        var RandomNum = Math.floor((Math.random() * (Noise * 2+1)) - Noise);

        RR = Math.max(1,Math.min(10,Degree+RandomNum));
        
        // RR = 0;
        //  while (RR > 10 || RR <= 0) {
        //      RR = Degree + (Math.floor((Math.random() * (Noise * 2))) - Noise);
        //  }
        //  ;
        if (RR <= 5) {
            R = Math.floor((Math.random() * 5) + 1);//[1 5]
        }
        else {
            R = Math.floor((Math.random() * 5) + 1) + 5;//[6 10]
        }
        return R;
    }
    ;

    // OverConfidence adviser function
    function OC_Adviser(Degree, Response) {
        var RandomNum = Math.floor((Math.random() * (Noise * 2+1)) - Noise);
        OO = Math.max(1,Math.min(10,Degree+RandomNum));
        
        //OO = 0;
        //   while (OO > 10 || OO <= 0) {
        //       OO = Degree + (Math.floor((Math.random() * (Noise * 2))) - Noise);
        //   }
        //   ;
        //
        O = BD_function[OO - 1];

        //console.log("OO : " + OO + " O : " + O);
        return O;
    }
    ;

    // Initial Display Parameters
    thisHeight = $(document).height() * .9;
    thisWidth = thisHeight * 4 / 3;

    DispWidth = thisHeight * 5 / 6;
    DispHeight = DispWidth / 2;

    ConfWidth = thisHeight * 4 / 6;
    ConfHeight = ConfWidth / 2;


    $('#Main').css('min-height', thisHeight);
    $('#Main').css('width', thisWidth);

    if (Math.random() > 0.5)
    {
        Adv_Img1 = 'Man1.png';
        Adv_Img2 = 'Man2.png';
    }
    else
    {
        Adv_Img1 = 'Man2.png';
        Adv_Img2 = 'Man1.png';
    }
    ;
    
    var Advisor1 = '<img id = "Advisor1" src="images/' + Adv_Img1 + '" height = "' + thisHeight * 0.15 + '" class="img-re\n\
        sponsive center-block" >';
    var Advisor2 = '<img id = "Advisor2" src="images/' + Adv_Img2 + '" height = "' + thisHeight * 0.15 + '" class="img-re\n\
        sponsive center-block" >';

    var Black_Box = '<img id = "BlackBox1" src="images/BlackBox.png" height = "' + thisHeight * 0.2 + '" >';
    var White_Box = '<img id = "WhiteBox1" src="images/WhiteBox.png" height = "' + thisHeight * 0.2 + '" >';

    var Black_Box_Coin = '<img id = "BlackBox1" src="images/BlackCoin.png"  height = "' + thisHeight * 0.25 + '" >';
    var Black_Box_Empty = '<img id = "BlackBox1" src="images/BlackEmpty.png" height = "' + thisHeight * 0.25 + '" >';

    var White_Box_Coin = '<img id = "WhiteBox1" src="images/WhiteCoin.png"  height = "' + thisHeight * 0.25 + '" >';
    var White_Box_Empty = '<img id = "WhiteBox1" src="images/WhiteEmpty.png" height = "' + thisHeight * 0.25 + '" >';

    var Red_Cross =     '<img id = "SadI" src="images/Sad.png"      class="img-responsive" height = "' + thisHeight * 0.15 + '"  >';
    var Happy_Face =    '<img id = "HappyI" src="images/Happy.png"   class="img-responsive" height = "' + thisHeight * 0.15 + '"  >';
    
    //   var Loading_Icon =    '<img id = "Loading_GIF" src="images/Loading_icon.gif"  height = "' + thisHeight * 0.18 + '" class="img-re\n\
    //     sponsive center-block" >';
    var Loading_Icon ='<div class="loader"></div>';
    var Arrow_height = thisHeight * 0.1;


    setTimeout(function () {
        Information();//Start with information sheet					
    },10);

    function Information() {

        // 
        $('#Top').css('height', thisHeight / 20);
        $('#Stage').css('width', DispWidth);
        $('#Stage').css('min-height', thisHeight * 17 / 20);
        $('#Bottom').css('min-height', thisHeight / 20);


        //console.log(Lin);
        //console.log(Order);

        Order = Shuffle(Order);
        //console.log(Order);
     
     
        CreateDiv('Stage', 'TextBoxDiv');
        var myMail = 'u.hertz' + '@' + 'ucl.ac.uk';
        var Info = '<H3 align = "center">Information page for participants in research studies</H3>' +
                'This study has been approved by the UCL Research Ethics Committee as Project ID Number: 5375/001<br>' +
                'Name, address and contact details of investigators:<br>' +
                'Uri Hertz<br>Institute of Cognitive Neuroscience<br>17 Queen Square<br>London WC1N 3AR<br>' +
                '<a href="mailto:' + myMail + '?Subject=Request Info" target="_top">' + myMail + '</a><br><br>' +
                'We would like to invite you to participate in this research project. You should only participate if you want to; choosing not to take part will not disadvantage you in any way. Before you decide whether you want to take part, please read the following information carefully and discuss it with others if you wish. Ask us if there is anything that is not clear or you would like more information.<br>' +
                'In this experiment you will see some simple objects on the screen. You will be asked to use your mouse or keyboard to make a decision between two options regarding the objects you saw. You will also be asked to answer some simple questions about yourself and about your experience of the tasks. Full instructions will be provided before the experiment begins. The experiment will last approximately 15 minutes. There are no anticipated risks or benefits associated with participation in this study.<br>' +
                'It is up to you to decide whether or not to take part. If you choose not to participate, you won&apos;t incur any penalties or lose any benefits to which you might have been entitled. However, if you do decide to take part, you can print out this information sheet and you will be asked to fill out a consent form on the next page. Even after agreeing to take part, you can still withdraw at any time and without giving a reason. <br>' +
                'All data will be collected and stored in accordance with the UK Data Protection Act 1998.<br>' +
                'Participants in our experiment must be over 18 years of age, with no substantial neurological or psychiatric disease, including depression (past or present).<br>';


        var Title = '<H3 align = "center">Information sheet</H3>';

        $('#TextBoxDiv').html(Title + Info);

        var Buttons = '<div align="center"><input align="center" type="button"  class="btn btn-default" id="toConsent" value="Next" ></div>';
        $('#Bottom').html(Buttons);

        $('#toConsent').click(function () {

            $('#TextBoxDiv').remove();
            $('#Stage').empty();
            $('#Bottom').empty();
            Consent();
        });
    }
    ;


    function Consent() {

        $('#Top').css('height', thisHeight / 20);
        $('#Stage').css('width', DispWidth);
        $('#Stage').css('min-height', thisHeight * 17 / 20);
        $('#Bottom').css('min-height', thisHeight / 20);

        CreateDiv('Stage', 'TextBoxDiv');

        var Title = '<H3 align = "center">Consent form for participants in research studies</H3>';

        var Ticks = '<input type="checkbox" name="consent" value="consent1" id= >I have read the information page<br>' +
                '<input type="checkbox" name="consent" value="consent2">I have had the opportunity to contact the researcher to ask questions and discuss the study<br>' +
                '<input type="checkbox" name="consent" value="consent3">I have received satisfactory answers to my questions or have been advised of an individual to contact for answers to pertinent questions about the research and my rights as a participant<br>' +
                '<input type="checkbox" name="consent" value="consent4">I understand that I am free to withdraw at any time, without giving a reason, and without incurring any penalty<br>' +
                '<input type="checkbox" name="consent" value="consent5">I am over 18 years of age.<br>';
        var Consent = 'This study has been approved by the UCL Research Ethics Committee as Project ID Number: 5375/001<br><br>' +
                'Thank you for your interest in taking part in this research. If you have any questions arising from the Information Page that you have already seen, please contact the experimenter before you decide whether to continue. You can go back to the Information Page by clicking the &apos;Go back to information page&apos; button below.<br><br>' +
                'Please confirm the following:<br><br>' +
                '<input type="checkbox" name="consent" value="consent1" id= >I have read the information page<br>' +
                '<input type="checkbox" name="consent" value="consent2">I have had the opportunity to contact the researcher to ask questions and discuss the study<br>' +
                '<input type="checkbox" name="consent" value="consent3">I have received satisfactory answers to my questions or have been advised of an individual to contact for answers to pertinent questions about the research and my rights as a participant<br>' +
                '<input type="checkbox" name="consent" value="consent4">I understand that I am free to withdraw at any time, without giving a reason, and without incurring any penalty<br>' +
                '<input type="checkbox" name="consent" value="consent5">I am over 18 years of age.<br>' +
                '<br>Please fill in the following details:<br><br>' +
                '<label >Worker Code:</label> <input type="text" name="textbox" id="CodeBox" value="" >  <br>  ' +
                '<label >Age:</label> <input type="text" name="textbox" id="AgeBox" value="" > &nbsp;&nbsp;&nbsp;&nbsp;' +
                'Education:<select id="eduDrop"><option value=""></option> <option value="basic">Basic</option> <option value="High">High School</option><option value="college">College</option><option value="post">Post Graduate</option></select>  &nbsp;&nbsp;&nbsp;&nbsp;' +
                '<br>Gender: <input type="radio" name="sex" value="male">Male &nbsp;&nbsp;<input type="radio" name="sex" value="female">Female<br>';



        $('#TextBoxDiv').html(Title + Consent);

        var Buttons = '<div align="center"><input align="center" type="button"  class="btn btn-default" id="toInstructions" value="Next" ></div>';
        $('#Bottom').html(Buttons);


        var thisSex = '';

        $("input[type=radio][name=sex]").click(function () {
            thisSex = $(this).val();
        });
        var thisEdu = '';
        $('#eduDrop').change(function () {
            thisEdu = $(this).val();
        });



        if (!($('#CheckAlert').length)) {
            var bottomTextDiv2 = $(document.createElement('div')).attr("class", 'Alert');
            bottomTextDiv2.attr("id", 'CheckAlert');
        }


        bottomTextDiv2.after().html('You must fill all the details to continue.');
        bottomTextDiv2.addClass('Stage');

        bottomTextDiv2.appendTo("#Stage");
        bottomTextDiv2.hide();
        $(document).on('click', '#toInstructions', function () {
            bottomTextDiv2.hide();

            var thisAge = $('#AgeBox').val();
            var thisCode = $('#CodeBox').val();

            //check input
            if ($("input:checkbox:not(:checked)").length > 0) {
                alert('You must tick all check boxes to continue.');
                //            bottomTextDiv1.show();
            } else {

                if (thisSex.length < 1) {
                    alert('You must fill all the details to continue.');
                    bottomTextDiv2.show();
                } else {

                    if (thisAge.length < 1) {

                        alert('You must fill all the details to continue.');
                        bottomTextDiv2.show();
                    } else {
                        if (thisAge < 18) {
                            $('#TextBoxDiv').remove();
                            $('#CheckAlert').remove();
                            $('#Stage').empty();
                            Final(1);
                        } else {
                            if (!(thisAge > 18)) {
                                alert('You must fill all the details to continue.');
                                bottomTextDiv2.show();
                            } else {


                                if (thisEdu.length < 2) {
                                    alert('You must fill all the details to continue.');
                                    bottomTextDiv2.show();

                                } else {
                                    if (thisCode.length === 0) {
                                        alert('You must fill all the details to continue.');
                                        bottomTextDiv2.show();
                                    } else {

                                        $('#TextBoxDiv').remove();
                                        $('#CheckAlert').remove();
                                        $('#Stage').empty();
                                        //check duplicate Codes
                                        $.ajax({
                                            type: 'POST',
                                            data: {thisCode: thisCode, ID: SubID},
                                            async: false,
                                            url: 'CheckSubCode.php',
                                            dataType: 'json',
                                            success: function (r) {
                                                console.log(r[0].ErrorNo);
                                                if (r[0].ErrorNo > 0) {
                                                    Duplicate();
                                                } else {
                                                    InsertDemog(thisAge, thisEdu, thisSex);
                                                }
                                                ;
                                            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                                                alert("Status: " + textStatus);
                                                alert("Error: " + errorThrown);
                                            }
                                        });
                                    }
                                }
                                ;
                            }
                            ;
                        }
                        ;
                    }
                    ;
                }
                ;

            }
            ;
        });


    }
    ;


    function InsertDemog(thisAge, thisEdu, thisSex) {

        //insert details and search for duplicate ID
        $.ajax({
            type: 'POST',
            data: {id: SubID, age: thisAge, education: thisEdu, gender: thisSex},
            async: false,
            url: 'InsertSubDetails.php',
            dataType: 'json',
            success: function (r) {

                if (r[0].ErrorNo > 0) {
                    SubID = CreateCode();
                    
                    RunExperiment(thisAge, thisEdu, thisSex);
                } else {
                    Instructions(1);               }
                ;

            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus);
                alert("Error: " + errorThrown);
            }
        });


    }
    ;



    function  Duplicate(){
     
        $('#Stage').empty();
        $('#Bottom').empty();
        $('#Stage').show();
        $('#Top').css('width', thisHeight / 2);
        $('#Top').css('height', thisHeight / 12);
        $('#Stage').css('width', ConfWidth);
        $('#Stage').css('min-height', thisHeight * 11 / 12);
        $('#Bottom').css('min-height', thisHeight / 20);
        $('#Stage').show();
        
        var ThisHTML='<div >\n\
 <div class="row">\n\
            <div class="col-md-12 text-center">\n\
 <div class="page-header ">\n\
<h2>Sorry, but it appears you already participated in this study or similar ones.</h2>\n\
<h2>If you have any enquiries please contact us:\n\
<h2>u.hertz@ucl.ac.uk</h2>\n\
</div>\n\
</div>\n\
</div>\n\
</div>';
     
      
        $('#Stage').html(ThisHTML);
        $('#Stage').show();
                                
        
    }

    // first page show the first page of experiment, second page show the second and third pages 
    function Instructions(PageNum) {
        $('#Top').css('height', thisHeight / 20);
        $('#Stage').css('width', DispWidth);
        $('#Stage').css('min-height', thisHeight * 17 / 20);
        $('#Bottom').css('min-height', thisHeight / 20);

        var NumPages = 9;//number of pages
        var PicHeight = DispWidth / 2;

        CreateDiv('Stage', 'TextBoxDiv');

        var Title = '<H2 align = "center">Instructions</H2>';

        switch (PageNum) {
            case 1:

                var Info = '<h3 align = "center">This experiment contains multiple trials.<br>\n\
                On each trial a coin is hidden in one of two boxes. <br>\n\
                You will get a coin every time your chosen advisor is correct about the colour. <br>\n\
                Your goal is to collect as many coins as possible. <br>\n\
                There are' + NumTrials + ' trials in this experiment.</h3>';
                break;

            case 2:
                var Info = '<H3 align = "center">You do not choose the box yourself, but rely on \n\
two advisers that have access to private information regarding the probability of \n\
the coin location.<br></h3><br><br>';
                break;

            case 3:
                var Info = '<h3 align = "center">In the beginning of each trial you  will chose an adviser. <br> \n\
In this example the blue adviser was chosen.</h3><br><br>';
                break;
            case 4:
                var Info = '<h3 align = "center">You will then wait for the advisers to evaluate \n\
their private information and make predictions about the location of the coin.</h3><br><br>';
                break;
            case 5:
                var Info = '<h3 align = "center">Adviser will show their predictions regarding coin location.<br>\n\
 The more stars they assign for a box, the more confident they are that the coin will be found there.</h3><br><br>';
                break;
            case 6:
                var Info = '<h3 align = "center">You will then see the coin location. <br>\n\
If your chosen adviser&#39s prediction is correct, you will earn a coin.</h3><br><br>';
                break;
            case 7:
                var Info = '<h3 align = "center">If your chosen adviser&#39s prediction is incorrect,\n\
 you will NOT earn a coin.</h3><br><br>';
                break;
            case 8:
                var Info = '<h3 align = "center">Then another trial will begin, and you will again pick an adviser.</h3><br><br>';
                break;
            case 9:
                var Info = '<h3 align = "center">At the end of the experiment you will be directed to a short questionnaire.<br> When you finish the questionnaire you will see how many coins you collected with the help of your advisers.<br>\n\
This will determine the amount of your bonus pay.<br>\n\
You will also get the completion code for the experiment.  </h3><br><br>';
                break;
            default:
                var Info;
                break;
        }
        ;


        var ThisImage = '<div align = "center"><img src="images/Inst' + PageNum + '.png" alt="house" height="' + PicHeight + '" align="center"></div>';

        $('#TextBoxDiv').html(Title + Info + ThisImage);

        var Buttons = '<div align="center"><input align="center" type="button"  class="btn btn-default" id="Back" value="Back" >\n\
<input align="center" type="button"  class="btn btn-default" id="Next" value="Next" >\n\
<input align="center" type="button"  class="btn btn-default" id="Start" value="Start!" ></div>';

        $('#Bottom').html(Buttons);

        if (PageNum === 1) {
            $('#Back').hide();
        }
        ;
        if (PageNum === NumPages) {
            $('#Next').hide();
        }
        ;
        if (PageNum < NumPages) {
            $('#Start').hide();
        }
        ;

        $('#Back').click(function () {
            $('#TextBoxDiv').remove();
            $('#Stage').empty();
            $('#Bottom').empty();
            Instructions(PageNum - 1);
        });

        $('#Next').click(function () {
            $('#TextBoxDiv').remove();
            $('#Stage').empty();
            $('#Bottom').empty();
            Instructions(PageNum + 1);
        });

        $('#Start').click(function () {
            $('#TextBoxDiv').remove();
            $('#Stage').empty();
            $('#Bottom').empty();
            Init = (new Date()).getTime();
            WaitForSubjects();
        });
        
    }
    ;


    function WaitForSubjects() {

        $('#Top').css('height', thisHeight / 20);
        $('#Top').empty();
        $('#Stage').empty();
        $('#Stage').css('width', DispWidth * 1.4); // adding this thing makes it big enought so that advviser sits in center !  
        $('#Stage').css('min-height', thisHeight * 17 / 20);
        $('#Bottom').css('min-height', thisHeight / 20);


        CreateDiv('Stage', 'TextBoxDiv');
        var Title = '<div id = "Title"><H2 align = "center">Please wait a moment for other participants to start.</div>';
        $('#TextBoxDiv').html(Title);

        CreateDiv('Stage', 'Wait');
        $('#Wait').html('<div class="loader"></div>');
        $('#Wait').css('margin-top', thisHeight * 0.12);
        $('#Wait').css('height', thisHeight * 0.2);
        $('#Wait').css('width', ConfWidth);
        $('#Wait').css('display', 'block');
        $('#Wait').css('margin', 'auto');
        $('#Wait').show();

        WaitS = Math.floor(Math.random() * 4000) + 3000;
        //WaitS = 1000;

        setTimeout(function () {


            setTimeout(function () {
                $('#Stage').html('<H1 align = "center">Ready</H1>');
                setTimeout(function () {
                    $('#Stage').html('<H1 align = "center">Steady</H1>');
                    setTimeout(function () {
                        $('#Stage').html('<H1 align = "center">Go!</H1>');
                        setTimeout(function () {
                            $('#Stage').empty();
                            Options(1);//Start with the first trial
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 10);


        }, WaitS);

    }

   

    function Options(TrialNum) {
        console.log("function Options");
        $('#Stage').empty();
        $('#Top').css('height', thisHeight / 20);
        $('#Stage').css('width', DispWidth * 1.4);
        $('#Stage').css('min-height', thisHeight * 17 / 20);
        $('#Bottom').css('min-height', thisHeight / 20);


        CreateDiv('Stage', 'TextBoxDiv');
        var Title = '<div id = "Title"><H2 align = "center">Choose an advisor:</H2></div>';
        $('#TextBoxDiv').html(Title);


        if (RandPosition[TrialNum - 1] < 0.5) {
            
            CreateDiv('Stage', 'Adviser1');
            $('#Adviser1').addClass('row');

            $('#Adviser1').html(Advisor1);
            $('#Adviser1').css('height', thisHeight * 0.2);
            $('#Adviser1').css('width', ConfWidth);
            $('#Adviser1').css('display', 'block');
            $('#Adviser1').css('margin', 'auto');
            $('#Adviser1').css('padding', '10px');
            $('#Adviser1').show();
          
            CreateDiv('Stage', 'Middle');
            $('#Middle').addClass('row');
            $('#Middle').css('margin', 'auto');
            $('#Middle').css('width', DispWidth * 1.2);
            $('#Middle').css('height', thisHeight * 0.25);
            $('#Middle').show();
            
            CreateDiv('Middle', 'BlackBox1');
            $('#BlackBox1').addClass('col-md-3');
            $('#BlackBox1').css('margin', 'auto');

         
            $('#BlackBox1').show();
            $('#BlackBox1').html(Black_Box);
            
            CreateDiv('Middle', 'Arrows');
            $('#Arrows').addClass('col-md-6');
            $('#Arrows').show();
            
            
            
            CreateDiv('Middle', 'WhiteBox1');
            $('#WhiteBox1').addClass('col-md-3');
            $('#WhiteBox1').css('margin', 'auto');

            $('#WhiteBox1').show();
            $('#WhiteBox1').html(White_Box);
         

            CreateDiv('Stage', 'Adviser2');
            $('#Adviser2').addClass('row');

            $('#Adviser2').html(Advisor2);
            $('#Adviser2').css('height', thisHeight * 0.2);
            $('#Adviser2').css('width', ConfWidth);
            $('#Adviser2').css('display', 'block');
            $('#Adviser2').css('margin', 'auto');
            $('#Adviser2').css('padding', '10px');
            $('#Adviser2').show();
            

        } else {
            
            CreateDiv('Stage', 'Adviser2');
            $('#Adviser2').addClass('row');

            $('#Adviser2').html(Advisor2);
            $('#Adviser2').css('height', thisHeight * 0.2);
            $('#Adviser2').css('width', ConfWidth);
            $('#Adviser2').css('display', 'block');
            $('#Adviser2').css('margin', 'auto');
            $('#Adviser2').css('padding', '10px');
            $('#Adviser2').show();
            
          
            CreateDiv('Stage', 'Middle');
            $('#Middle').addClass('row');
            $('#Middle').css('margin', 'auto');
            $('#Middle').css('width', DispWidth * 1.2);
            $('#Middle').css('height', thisHeight * 0.25);

            
            $('#Middle').show();
            
            CreateDiv('Middle', 'BlackBox1');
            $('#BlackBox1').addClass('col-md-3');
            $('#BlackBox1').css('margin', 'auto');

         
            $('#BlackBox1').show();
            $('#BlackBox1').html(Black_Box);
            
            CreateDiv('Middle', 'Arrows');
            $('#Arrows').addClass('col-md-6');
            $('#Arrows').show();
            
            
            
            CreateDiv('Middle', 'WhiteBox1');
            $('#WhiteBox1').addClass('col-md-3');
            $('#WhiteBox1').css('margin', 'auto');

            $('#WhiteBox1').show();
            $('#WhiteBox1').html(White_Box);
         



            CreateDiv('Stage', 'Adviser1');
            $('#Adviser1').addClass('row');

            $('#Adviser1').html(Advisor1);
            $('#Adviser1').css('height', thisHeight * 0.2);
            $('#Adviser1').css('width', ConfWidth);
            $('#Adviser1').css('display', 'block');
            $('#Adviser1').css('margin', 'auto');
            $('#Adviser1').css('padding', '10px');
            $('#Adviser1').show();



        }
        
        $('#Adviser1').css('cursor', 'pointer');
        $('#Adviser2').css('cursor', 'pointer');
        tic = (new Date()).getTime(); // for RT of choosing adviser 

        // setTimeout(function() {
        //     RT = (new Date()).getTime() - tic; // for RT of choosing adviser
        //      $(this).css({"border-color": "#d7f0fd",
        //          "border-width": "5px",
        //          "border-style": "solid",
        //         "border-radius": "10px"});
        //      console.log("Advisor1 chosen");

        //      setTimeout(function() {
        //           document.getElementById("Advisor1").onclick = function() {
        //               return false;
        //           };
        //           WaitForAdviser(TrialNum, 1);
        //       }, 10);
        //   }, 10);
            
            
        // take response (Advisor 1 or 2) send to GetAdvice,  
        $('#Advisor1').click(function () {
            RT = (new Date()).getTime() - tic; // for RT of choosing adviser
            $(this).css({"border-color": "#d7f0fd",
                "border-width": "5px",
                "border-style": "solid",
                "border-radius": "10px"});
            console.log("Advisor1 chosen");

            setTimeout(function () {
                document.getElementById("Advisor1").onclick = function () {
                    return false;
                };
                WaitForAdviser(TrialNum, 1);
            }, 1000);

        });


        $('#Advisor2').click(function () {
            $('#Advisor2').click(false);
            RT = (new Date()).getTime() - tic; // for RT of choosing adviser 
            $(this).css({"border-color": "#d7f0fd",
                "border-width": "5px",
                "border-style": "solid",
                "border-radius": "10px"});
            console.log("Advisor2 chosen");

            setTimeout(function () {
                document.getElementById("Advisor2").onclick = function () {
                    return false;
                };
                WaitForAdviser(TrialNum, 2);
            }, 1000);

        });

    }
    


    function WaitForAdviser(TrialNum, ThisResponse) {

        $('#Top').css('height', thisHeight / 20);
        $('#Top').empty();
        //$('#Stage').empty();
        $('#Stage').css('width', DispWidth * 1.4); // adding this thing makes it big enought so that advviser sits in center !  
        $('#Stage').css('min-height', thisHeight * 17 / 20);
        $('#Bottom').css('min-height', thisHeight / 20);
        $('#Adviser1').css('cursor', 'default');
        $('#Adviser2').css('cursor', 'default');
        CreateDiv('Stage', 'TextBoxDiv');
        var Title = '<div id = "Title"><H2 align = "center"> Advisers are evaluating </H2></div>';
        $('#TextBoxDiv').html(Title);



        CreateDiv('Stage', 'Wait');
        $('#Wait').css('margin-top', -thisHeight * 0.4);
        $('#Wait').css('text-align', 'center');
        $('#Wait').html(Loading_Icon);
       
        $('#Wait').show();
            
            

        //    WaitT = Math.floor(Math.random() * 2000) + 1000;
        WaitT = 500;
        setTimeout(function () {
            ShowAdvice(TrialNum, ThisResponse);
        }, WaitT);
    }


    //Showing the advisers and their advice
    function ShowAdvice(TrialNum, Response) {
        console.log("function ShowAdvice");

        $('#Top').css('height', thisHeight / 20);
        //$('#Stage').empty();
        $('#Stage').css('width', DispWidth * 1.4); // adding this thing makes it big enought so that advviser sits in center !  
        $('#Stage').css('min-height', thisHeight * 17 / 20);
        $('#Bottom').css('min-height', thisHeight / 20);
        $('#Wait').remove();

        // Chosing advisors for condition
        switch (Condition) {
            case 1:
                Advice1 = BD_Adviser(BW_Degree[TrialNum - 1], Response);
                Advice2 = Li_Adviser(BW_Degree[TrialNum - 1], Response);
                if (Response === 1) {
                    AdvisorOutcome = Advice1;
                    AdvisorChosen = "B&D_Advisor";
                    ThisResponse = 1
                    ;
                }
                else if (Response === 2) {
                    AdvisorOutcome = Advice2;
                    AdvisorChosen = "Linear_Advisor";
                    ThisResponse = 2;
                }
                break;

            case 2:
                Advice1 = BD_Adviser(BW_Degree[TrialNum - 1], Response);
                Advice2 = Ra_Adviser(BW_Degree[TrialNum - 1], Response);
                if (Response === 1) {
                    AdvisorOutcome = Advice1;
                    AdvisorChosen = "B&D_Advisor";
                    ThisResponse = 1;
                }
                else if (Response === 2) {
                    AdvisorOutcome = Advice2;
                    AdvisorChosen = "Random_Advisor";
                    ThisResponse = 2;
                }
                break;

            case 3:
                Advice1 = Lin[Order[TrialNum-1]];//Li_Adviser(BW_Degree[TrialNum - 1], Response);
                Advice2 = Rand[Order[TrialNum-1]];//Ra_Adviser(BW_Degree[TrialNum - 1], Response);
                if (Response === 1) {
                    AdvisorOutcome = Advice1;
                    AdvisorChosen = "Linear_Advisor";
                    ThisResponse = 1;
                }
                else if (Response === 2) {
                    AdvisorOutcome = Advice2;
                    AdvisorChosen = "Random_Advisor";
                    ThisResponse = 2;
                }
                break;

            case 4: //  Linear          OverConfidence
                Advice1 = Li_Adviser(BW_Degree[TrialNum - 1], Response);
                Advice2 = OC_Adviser(BW_Degree[TrialNum - 1], Response);
                if (Response === 1) {
                    AdvisorOutcome = Advice1;
                    AdvisorChosen = "Linear_Advisor";
                    ThisResponse = 1;
                    ;
                }
                else if (Response === 2) {
                    AdvisorOutcome = Advice2;
                    AdvisorChosen = "OverConf_Advisor";
                    ThisResponse = 2;
                }
                break;

            case 5: //B & D           Overconfidence
                Advice1 = BD_Adviser(BW_Degree[TrialNum - 1], Response);
                Advice2 = OC_Adviser(BW_Degree[TrialNum - 1], Response);
                if (Response === 1) {
                    AdvisorOutcome = Advice1;
                    AdvisorChosen = "B&D_Advisor";
                    ThisResponse = 1;
                    ;
                }
                else if (Response === 2) {
                    AdvisorOutcome = Advice2;
                    AdvisorChosen = "OverConf_Advisor";
                    ThisResponse = 2;
                }
                break;

            case 6: // Random          Overconfidence
                Advice1 = Ra_Adviser(BW_Degree[TrialNum - 1], Response);
                Advice2 = OC_Adviser(BW_Degree[TrialNum - 1], Response);
                if (Response === 1) {
                    AdvisorOutcome = Advice1;
                    AdvisorChosen = "Random_Advisor";
                    ThisResponse = 1;
                    ;
                }
                else if (Response === 2) {
                    AdvisorOutcome = Advice2;
                    AdvisorChosen = "OverConf_Advisor";
                    ThisResponse = 2;
                }
                break;
        }


        //      For checking the advice 
        console.log("This response = " + ThisResponse + " Previous response = " + PreviousResponse);
        console.log(AdvisorChosen + " is chosen");
        console.log("Advisor1   = " + Advice1);
        console.log("Advisor2   = " + Advice2);


        CreateDiv('Stage', 'TextBoxDiv');
        var Title = '<div id = "Title"><H2 align = "center">Here is their advice</H2></div>';
        $('#TextBoxDiv').html(Title);


        // for correctly floating the arrows 
        if (Advice1 > 5) {
            FloatDir_1 = 'right';
            MarginDir_1 = 'margin-right';
        }
        else {
            FloatDir_1 = 'left';
            MarginDir_1 = 'margin-left';
        }

        if (Advice2 > 5) {
            FloatDir_2 = 'right';
            MarginDir_2 = 'margin-right';
        }
        else {
            FloatDir_2 = 'left';
            MarginDir_2 = 'margin-left';
        }


        CreateDiv('Arrows', 'ArrowBox_T');
        $('#ArrowBox_T').css('height', thisHeight * 0.1);
        $('#ArrowBox_T').css('width', Arrow_height * 4.5);
        $('#ArrowBox_T').css('display', 'block');
        $('#ArrowBox_T').css('margin', 'auto');
        CreateDiv('ArrowBox_T', 'Arrow_T');
            
        CreateDiv('Arrows', 'ArrowBox_B');
        $('#ArrowBox_B').css('height', thisHeight * 0.1);
        $('#ArrowBox_B').css('width', Arrow_height * 4.5);
        $('#ArrowBox_B').css('display', 'block');
        $('#ArrowBox_B').css('margin', 'auto');
        CreateDiv('ArrowBox_B', 'Arrow_B');
            
        if (RandPosition[TrialNum - 1] < 0.5) {

            $('#Arrow_T').html('<img id = "ArrowBox_T" src="images/Arrow_T_' + Advice1 + '.png" height = "' + Arrow_height + '" >'); //class="img-responsive center-block" 
            $('#Arrow_T').css('float',FloatDir_1);
           
                      
            $('#Arrow_B').html('<img id = "ArrowBox_B" src="images/Arrow_B_' + Advice2 + '.png" height = "' + Arrow_height + '" >'); //class="img-responsive center-block" 
            $('#Arrow_B').css('float', FloatDir_2);
          

        } else {
        
            $('#Arrow_T').html('<img id = "ArrowBox_T" src="images/Arrow_T_' + Advice2 + '.png" height = "' + Arrow_height + '" >'); //class="img-responsive center-block" 
            $('#Arrow_T').css('float',FloatDir_2);
       
                                
            $('#Arrow_B').html('<img id = "ArrowBox_B" src="images/Arrow_B_' + Advice1 + '.png" height = "' + Arrow_height + '" >'); //class="img-responsive center-block" 
            $('#Arrow_B').css('float', FloatDir_1);
           

        }
        $('#Arrow_B').show();
        $('#Arrow_T').show(); 

        // Creat a frame for the chosen adviser // id = "Highlight1" change back to adviser1 and 2
        if (ThisResponse === 1) {
            $(Adviser1).css({"background-color": "#d7f0fd", "border-radius": "10px"});
            //$(Adviser1).css({"border-color": "#668aff", "border-width": "4px", "border-style": "solid", "border-radius": "10px"});
        } else {
            $(Adviser2).css({"background-color": "#d7f0fd", "border-radius": "10px"});
            //$(Adviser2).css({"border-color": "#668aff", "border-width": "4px", "border-style": "solid", "border-radius": "10px"});
        }



        //wait a bit and go to Outcome page,
        console.log("ShowAdvice finished");



        setTimeout(function () {
            Outcome(TrialNum, ThisResponse);
        }, TimeShowadvice);

    }
    ;


    //REWARD SCREEN,
    function Outcome(TrialNum, Choice) {
        console.log("function Outcome");

        $('#Title').empty();
        $('#Top').css('height', thisHeight / 20);
        $('#Stage').css('width', DispWidth * 1.4);
        $('#Stage').css('min-height', thisHeight * 17 / 20);
        $('#Bottom').css('min-height', thisHeight / 20);

        CreateDiv('Stage', 'TextBoxDiv');

        //Creat a random number if its bigger than degree then coin is in white 
        //if it is smaller than degree then coin is in black 
        CoinLocation = (0); // to warn in case for some reason below doesnt work
        CoinLocation = (SideCorrect[Order[TrialNum-1]]+3)/2;
        //  RandomValue = Math.floor(Math.random() * 100)+1;//[1-100]
        // Where is the coin?
        //  if (RandomValue > (10*BW_Degree[TrialNum - 1]-5 )){
        //      CoinLocation = 1; //It's in BLACK box
        //  }
        // else {
        //     CoinLocation = 2; //It's in WHITE box
        //}

        // white is on right side 

        // console.log("BW_Degree               = " + BW_Degree[TrialNum - 1]);
        //  console.log("RandomValue             = " + RandomValue);
        console.log("CoinLocation            = " + CoinLocation);
        console.log("AdvisorOutcome          = " + AdvisorOutcome);


        var ThisReward = 0;

        // WIN:  ADVICE WHITE           LOCATION WHITE                      1
        if (AdvisorOutcome > 5 && CoinLocation === 2) {
            ThisReward = 1;
            console.log("Correct, Both White, Reward = " + ThisReward);
            SumReward += 1;
            console.log("Sum of Reward               = " + SumReward);
            $('#Title').html('<H2 align = "center">You got a coin!!</H2>');

       
            $('#BlackBox1').html(Black_Box_Empty);

      
            $('#WhiteBox1').html(White_Box_Coin);
 
            $('#Middle').css({
                'background-image' : 'url("images/Happy.png")',
                'background-size'  :  thisHeight *0.2,
                'background-repeat': 'no-repeat',
                'background-position': 'center top' 
            });


            //ToNext(TrialNum);
        }

        // WIN:  ADVICE BLACK           LOCATION BLACK                      2
        else if (AdvisorOutcome <= 5 && CoinLocation === 1) {
            ThisReward = 1;
            console.log("Correct, Both Black, Reward = " + ThisReward);
            SumReward += 1;
            console.log("Sum of Reward               = " + SumReward);
            $('#Title').html('<H2 align = "center">You got a coin!!</H2>');

         
            $('#BlackBox1').show();
            $('#BlackBox1').html(Black_Box_Coin);
     
            $('#WhiteBox1').show();
            $('#WhiteBox1').html(White_Box_Empty);

            $('#Middle').css({
                'background-image' : 'url("images/Happy.png")',
                'background-size'  :  thisHeight *0.2,
                'background-repeat': 'no-repeat',
                'background-position': 'center top' 
            });
  
            // ToNext(TrialNum);
        }

        // LOOSE:  ADVICE WHITE         LOCATION BLACK                      3
        else if (AdvisorOutcome > 5 && CoinLocation === 1) {
       
            $('#Title').html('<H2 align = "center">You got nothing...</H2>');

        
            $('#BlackBox1').show();
            $('#BlackBox1').html(Black_Box_Coin);

      
            $('#WhiteBox1').html(White_Box_Empty);

            $('#Middle').css({
                'background-image' : 'url("images/Sad.png")',
                'background-size'  :  thisHeight *0.2,
                'background-repeat': 'no-repeat',
                'background-position': 'center top' 
            });

          
        }

        // LOOSE:  ADVICE BLACK         LOCATION WHITE                      4
        else if (AdvisorOutcome <= 5 && CoinLocation === 2) {
            console.log("Incorrect, Reward = " + ThisReward);
            console.log("Sum of Reward     = " + SumReward);
            $('#Title').html('<H2 align = "center">You got nothing...</H2>');

 
            $('#BlackBox1').html(Black_Box_Empty);
     
            $('#WhiteBox1').html(White_Box_Coin);

            $('#Middle').css({
                'background-image' : 'url("images/Sad.png")',
                'background-size'  :  thisHeight *0.2,
                'background-repeat': 'no-repeat',
                'background-position': 'center top' 
            });

            //ToNext(TrialNum);
        }

        var Buttons = '<div align="center"><input align="center" type="button"  class="btn btn-default" id="Next" value="Next" ></div>';
     
        $('#Bottom').html(Buttons);
        $('#Bottom').css('display','block');
        // setTimeout(function () { ToNext(TrialNum);    
        // },10);
        
        
        $('#Next').click(function () {
            ToNext(TrialNum);    
        });
        
        function ToNext(TrialNum) {
            console.log("ToNext");




            var startTime = (new Date()).getTime();
            var t = (new Date()).getTime();

            $.ajax({
                type: 'POST',
                data: {ID: SubID, Condition: Condition, TrialNum: TrialNum, Time: startTime - Init, RT: RT, BW_Degree: 0, Top: Math.round(RandPosition[TrialNum - 1]), ThisResponse: ThisResponse, Advice1: Advice1 ,Advice2: Advice2, CoinLocation: CoinLocation,ThisReward: ThisReward, SumReward: SumReward, T: t},
                //data: {ID: SubID, TrialNum: TrialNum, Time: startTime - Init},
                async: false,       
                url: 'InsertTrialData.php',            
                dataType: 'json',
                success: function (r) {
                    if (r[0].ErrorNo > 0) {

                    } else {

                        if (TrialNum < NumTrials) {
                            setTimeout(function () {
                                $('#TextBoxDiv').empty();
                                $('#Stage').empty();
                                $('#Bottom').empty();
                                PreviousResponse = ThisResponse;
                                Options(TrialNum + 1);
                            }, 10);
                        } else {            
                            setTimeout(function () {
                                $('#TextBoxDiv').remove();
                                $('#Stage').empty();
                                $('#Bottom').empty();
                                Questionnaire();
                            }, 10);
                        }


                    }
                    ;
                }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Status: " + textStatus);
                    alert("Error: " + errorThrown);
                }
            });



        }
    }
    ;


    function Questionnaire(){
    
        $('.Main').css('background-color', '#EEEEEE');
        var ConfWidth = thisHeight * 5 / 6;
        var ConfHeight = ConfWidth / 2;
        //  $('.Top').empty();
        // $('.Stage').empty();
        //$('.Top').css('width', ConfWidth);
        // $('.Top').css('height', thisHeight / 12);
        //$('.Stage').css('width',  thisWidth * 11 / 12);
        //$('.Stage').css('min-height', thisHeight / 2);
        // $('.Stage').css('text-align', 'center');
    
        $('#Title').empty();
        $('#Top').css('height', thisHeight / 20);
        $('#Stage').css('width', DispWidth * 1.4);
        $('#Stage').css('min-height', thisHeight * 17 / 20);
        $('#Bottom').css('min-height', thisHeight / 20);
        
        
        CreateDiv('Stage', 'Test');
       
        $('#Test').css('width', thisWidth * 11 / 12);
        $('#Test').addClass('Stage');
        $('#Test').show();
       
        $( "#Test" ).load( "Quest.html", function() {
            QuestSubmit();
        });

    }
       
       
        
    function QuestSubmit(){
 
       
        var form = document.getElementById('Quest1');
        
        if (form.attachEvent) {
            form.attachEvent("submit", processForm);
        } else {
            form.addEventListener("submit", processForm);
        }
        
        function processForm(e) {
            if (e.preventDefault)
                e.preventDefault();

            var ThusForm = document.getElementById('Quest1');
            var Q1Q01 = ThusForm.elements['Q1'].value;
            var Q1Q02 = ThusForm.elements['Q2'].value;
            var Q1Q03 = ThusForm.elements['Q3'].value;
            var Q1Q04 = ThusForm.elements['Q4'].value;
            var Q1Q05 = ThusForm.elements['Q5'].value;
            var Q1Q06 = ThusForm.elements['Q6'].value;
            var Q1Q07 = ThusForm.elements['Q7'].value;
            var Q1Q08 = ThusForm.elements['Q8'].value;
            var Q1Q09 = ThusForm.elements['Q9'].value;
            var Q1Q10 = ThusForm.elements['Q10'].value;
            var Q1Q11 = ThusForm.elements['Q11'].value;
            var Q1Q12 = ThusForm.elements['Q12'].value;
            
            var Q2Q01 = ThusForm.elements['Q13'].value;
            var Q2Q02 = ThusForm.elements['Q14'].value;
            var Q2Q03 = ThusForm.elements['Q15'].value;
            var Q2Q04 = ThusForm.elements['Q16'].value;
            var Q2Q05 = ThusForm.elements['Q17'].value;
            var Q2Q06 = ThusForm.elements['Q18'].value;
            var Q2Q07 = ThusForm.elements['Q19'].value;
            var Q2Q08 = ThusForm.elements['Q20'].value;
            var Q2Q09 = ThusForm.elements['Q21'].value;
            var Q2Q10 = ThusForm.elements['Q22'].value;
            var Q2Q11 = ThusForm.elements['Q23'].value;


            $('#TextBoxDiv').remove();
            $('#CheckAlert').remove();
            $('#Stage').empty();
            //check duplicate Codes
            $.ajax({
                type: 'POST',
                data: { ID: SubID,Q1Q01:Q1Q01,Q1Q02:Q1Q02,Q1Q03:Q1Q03,Q1Q04:Q1Q04,Q1Q05:Q1Q05,Q1Q06:Q1Q06,Q1Q07:Q1Q07,Q1Q08:Q1Q08,Q1Q09:Q1Q09,Q1Q10:Q1Q10,Q1Q11:Q1Q11,Q1Q12:Q1Q12,Q2Q01:Q2Q01,Q2Q02:Q2Q02,Q2Q03:Q2Q03,Q2Q04:Q2Q04,Q2Q05:Q2Q05,Q2Q06:Q2Q06,Q2Q07:Q2Q07,Q2Q08:Q2Q08,Q2Q09:Q2Q09,Q2Q10:Q2Q10,Q2Q11:Q2Q11},
                async: false,
                url: 'InsertQuest.php',
                dataType: 'json',
                success: function(r) {

                    if (r[0] > 0) {
                        Exit(6);
                    } else {
                        End();
                    }
                    ;
                }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("Status: " + textStatus);
                    alert("Error: " + errorThrown);
                }
            });

            return false;
        }
        
       
       
    }
    function End() {
        console.log("function End");

        $('#Top').css('height', thisHeight / 20);
        $('#Stage').css('width', DispWidth);
        $('#Stage').css('min-height', thisHeight * 17 / 20);
        $('#Bottom').css('min-height', thisHeight / 20);

        CreateDiv('Stage', 'TextBoxDiv');

        var Title = '<H2 align = "center">You have finished the experiment!<br> <br> You earned ' + SumReward + ' coins!<br> Your completion code is: ' + SubID + '<br><br> Thanks for participating!</H2>';

        $('#TextBoxDiv').html(Title);

        var startTime = (new Date()).getTime();

        $.ajax({
            type: 'POST',
            data: {SubID: SubID, AllTime: startTime - Init},
            async: false,
            url: 'FinishCode.php',
            dataType: 'json',
            success: function (r) {
                if (r[0].ErrorNo > 0) {
                    sequence(6);
                } else {
                    var d = new Date();
                    var thistime = (d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes());
                    var ConsentTxt = 'Subject completed the experiment on' + thistime + '. Completion code: ' + SubID + ' . ' + 'The Agent \n\
chosen to follow your advice times!';


                    $.post('SendInfoEmail.php', {email: 'u.hertz@ucl.ac.uk', from: 'u.hertz@ucl.ac.uk', subject: 'Judgement finish code for approval', content: ConsentTxt}, function (data) {
                    });
                }
                ;

            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus);
                alert("Error: " + errorThrown);
            }
        });



    }
    ;


    //Utility Functions
    function CreateDiv(ParentID, ChildID) {

        var d = $(document.createElement('div'))
                .attr("id", ChildID);
        var container = document.getElementById(ParentID);

        d.appendTo(container);
    }
    ;
    
    
    function Shuffle(array) {
        console.log(array);

        var currentIndex = array.length
        , temporaryValue
        , randomIndex
        ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
   
        return array;
    }
    ;


});
