  <?php

if(isset($_POST['email'])) {
     
    $email_to = "repair@fullcustommusic.com";
     
    $email_subject = "Digital Repair Tag";
     
     
    function died($error) {
        // your error code can go here
        echo "We are very sorry, but there were error(s) found with the form you submitted. ";
        echo "These errors appear below.<br /><br />";
        echo $error."<br /><br />";
        echo "Please go back and fix these errors.<br /><br />";
        die();
    }
     
    // validation expected data exists
    if(!isset($_POST['first_name']) ||
        !isset($_POST['last_name']) ||
        !isset($_POST['street_address']) ||
        !isset($_POST['city']) ||
        !isset($_POST['state']) ||
        !isset($_POST['zip']) ||
        !isset($_POST['email']) ||
        !isset($_POST['telephone']) ||
        !isset($_POST['manufacturer']) ||
        !isset($_POST['model']) ||
        !isset($_POST['serial_number']) ||
        !isset($_POST['comments'])) {
        died('<p>Well... <i>That<i> did not work.</p>');       
    }
     
    $first_name = $_POST['first_name']; // required
    $last_name = $_POST['last_name']; // required
    $street_address = $_POST['street_address']; // required
    $city = $_POST['city']; // required
    $state = $_POST['state']; // required
    $zip = $_POST['zip']; // required
    $email_from = $_POST['email']; // required
    $telephone = $_POST['telephone']; // required
    $manufacturer = $_POST['manufacturer']; // required
    $model = $_POST['model']; // required
    $serial_number = $_POST['serial_number']; // required
    $comments = $_POST['comments']; // required
     
    $error_message = "";
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
  if(!preg_match($email_exp,$email_from)) {
    $error_message .= 'The Email Address you entered does not appear to be valid.<br />';
  }
    $string_exp = "/^[A-Za-z .'-]+$/";
  if(!preg_match($string_exp,$first_name)) {
    $error_message .= 'The First Name you entered does not appear to be valid.<br />';
  }
  if(!preg_match($string_exp,$last_name)) {
    $error_message .= 'The Last Name you entered does not appear to be valid.<br />';
     }
  if(strlen($street_address) < 2) {
    $error_message .= 'The Street Address you entered do not appear to be valid.<br />';
   }
    $string_exp = "/^[A-Za-z .'-]+$/";
  if(!preg_match($string_exp,$city)) {
    $error_message .= 'The City you entered does not appear to be valid.<br />';
  }
  if(!preg_match($string_exp,$state)) {
    $error_message .= 'The State you entered does not appear to be valid.<br />'; 
  }
  if(strlen($zip) < 2) {
    $error_message .= 'The Zip Code you entered does not appear to be valid.<br />';
  }
  if(strlen($telephone) < 2) {
    $error_message .= 'The Phone Number you entered does not appear to be valid.<br />';
      }
  if(strlen($manufacturer) < 2) {
    $error_message .= 'The Manufacturer you entered does not appear to be valid.<br />';
      }
  if(strlen($model) < 2) {
    $error_message .= 'The Model you entered does not appear to be valid.<br />';
      }
  if(strlen($serial_number) < 2) {
    $error_message .= 'The Serial Number you entered does not appear to be valid.<br />';
  }
  if(strlen($comments) < 2) {
    $error_message .= 'The Comments you entered do not appear to be valid.<br />';
  }
  if(strlen($error_message) > 0) {
    died($error_message);
  }
    $email_message = "Form details below.\n\n";
     
    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }
     
    $email_message .= "First Name: ".clean_string($first_name)."\n";
    $email_message .= "Last Name: ".clean_string($last_name)."\n";
    $email_message .= "Street Address: ".clean_string($street_address)."\n";
    $email_message .= "City: ".clean_string($city)."\n";
    $email_message .= "State: ".clean_string($state)."\n";
    $email_message .= "Zip: ".clean_string($zip)."\n";
    $email_message .= "Email: ".clean_string($email_from)."\n";
    $email_message .= "Telephone: ".clean_string($telephone)."\n";
    $email_message .= "Manufacturer: ".clean_string($manufacturer)."\n";
    $email_message .= "Model: ".clean_string($model)."\n";
    $email_message .= "Serial Number: ".clean_string($serial_number)."\n";
    $email_message .= "Comments: ".clean_string($comments)."\n";
     
     
// create email headers
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();
@mail($email_to, $email_subject, $email_message, $headers);  
?>
 
<!-- place your own success html below -->
<object width="100%" height="100%" data="success.html">
</object>
 
<?php
}
die();
?>