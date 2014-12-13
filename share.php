<?php
$front_root = 'http://instilive.com/#/';
$back_root = 'http://workarounds.in/vnb/api/';


function getData($type, $param) {
    global $back_root;
    global $result;
//    echo 'called url <br>';
    $url =  $back_root . 'notices/view';
    $data = array('type' => $type, 'param' => $param);

    // use key 'http' even if you send the request to https://...
    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
        ),
    );
    $context  = stream_context_create($options);
    $full_result = json_decode(file_get_contents($url, false, $context), true);
//    var_dump($http_response_header);
    $result = $full_result['data']['data'];
//    print_r($full_result);
//    echo '<br> end getdata <br>';
}

function getBoard($board_tag) {

}

function getCorner($corner_tag) {

}

if(isset($_GET['notice'])) {
    $notice_id = $_GET['notice'];
    getData('notice', $notice_id);
} elseif(isset($_GET['board'])) {
    $board_tag = $_GET['board'];
} elseif(isset($_GET['corner'])) {
    $corner_tag = $_GET['corner'];
} else {

}
?>

<html itemscope itemtype="http://schema.org/Article">

<head>
<!-- Place this data between the <head> tags of your website -->
<title><?php echo $result['title'] ?></title>
<meta name="description" content=<?php echo '"'.$result['description'].'"'?> />

<!-- Schema.org markup for Google+ -->
<meta itemprop="name" content=<?php echo '"'.$result['title'].'"'?>>
<meta itemprop="description" content=<?php echo '"'.$result['description'].'"'?>>
<meta itemprop="image" content=<?php echo '"'.$result['image_url'].'"'?>>

<!-- Twitter Card data -->
<meta name="twitter:card" content="summary_card">
<meta name="twitter:site" content="@instilive">
<meta name="twitter:title" content=<?php echo '"'.$result['title'].'"'?>>
<meta name="twitter:description" content=<?php echo '"'.$result['description'].'"'?>>
<meta name="twitter:creator" content="@instilive">
<!-- Twitter summary card with large image must be at least 280x150px -->
<meta name="twitter:image:src" content=<?php echo '"'.$result['image_url'].'"'?>>

<!-- Open Graph data -->
<meta property="og:title" content=<?php echo '"'.$result['title'].'"'?> />
<meta property="og:type" content="article" />
<meta property="og:url" content=<?php echo 'http://instilive.com/share.php?notice='.$notice_id ?> />
<meta property="og:image" content=<?php echo '"'.$result['image_url'].'"'?> />
<meta property="og:video" content=<?php echo '"'.$result['video_url'].'"'?> />
?>
<meta property="og:description" content=<?php echo '"'.$result['description'].'"'?> />
<meta property="og:site_name" content=<?php echo '"' .$name.'"' ?> />
<meta property="article:published_time" content=<?php echo '"' .$result['created'].'"' ?> />
<meta property="article:modified_time" content=<?php echo '"' .$result['modified'].'"' ?> />
</head>

<body>
    <script type="text/javascript">
        (function(){
            window.location.href = '<?php echo($front_root.'home/direct/'.$notice_id); ?>';
        })();
    </script>
</body>

</html>

