<?php
$front_root = 'http://instilive.com/#/';
$back_root = 'http://128.199.251.79/vnb/api/';
$content_type = 'article';
$has_video = false;
$name = 'Instilive';
$main_image = 'http://i.imgur.com/NzpBSKQ.jpg';


function getData($param) {
    global $back_root;
    global $result;
    global $content_type;
    global $has_video;
    global $main_image;
    //    echo 'called url <br>';
    $url =  $back_root . 'notices/view';
    $data = array('type' => 'notice', 'param' => $param);

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
    //var_dump($full_result);
    //var_dump($http_response_header);
    $result = $full_result['data']['data'];
    if(isset($result['video_url']) && ($result['video_url'] != '')) {
        $v_url = constructVideoUrl($result['video_url']);
        if($v_url) {
            $result['video_url'] = $v_url;
        } else {
            $vurl = constructAltVUrl($result['video_url']);
            if($vurl) {
                $result['video_url'] = $vurl;
            }
        }
        $content_type = 'video';
        $has_video = true;
    } else {
        $content_type = 'article';
        $has_video = false;
    }

    if(isset($result['image_url']) && $result['image_url']!='') {
        $main_image = $result['image_url'];
    }
//    print_r($full_result);
//    echo '<br> end getdata <br>';
}

function constructVideoUrl($url) {
    $parsed_url = parse_url($url);
    $query = $parsed_url['query'];

    $parsed_query = array();
    parse_str($query, $parsed_query);
    $v = $parsed_query['v'];
    if($v) {
        return 'https://www.youtube.com/v/' . $v;
    } else {
        return null;
    }
}

function constructAltVUrl($url) {
    $parsed_url = parse_url($url);
    $fragment = $parsed_url['fragment'];
    $fragment_parts = explode('/', $fragment);
    $video_id = array_pop($fragment_parts);
    if($video_id) {
        return 'https://www.youtube.com/v/'.$video_id;
    } else {
        return null;
    }
}

if(isset($_GET['notice'])) {
    $notice_id = $_GET['notice'];
    getData($notice_id);
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
<meta itemprop="image" content=<?php echo '"'.$main_image.'"'?>>

<!-- Twitter Card data -->
<meta name="twitter:card" content="summary_card">
<meta name="twitter:site" content="@instilive">
<meta name="twitter:title" content=<?php echo '"'.$result['title'].'"'?>>
<meta name="twitter:description" content=<?php echo '"'.$result['description'].'"'?>>
<meta name="twitter:creator" content="@instilive">
<!-- Twitter summary card with large image must be at least 280x150px -->
<meta name="twitter:image:src" content=<?php echo '"'.$main_image.'"'?>>

<!-- Open Graph data -->
<meta property="og:title" content=<?php echo '"'.$result['title'].'"'?> />
<meta property="og:type" content=<?php echo '"'.$content_type.'"'; ?> />
<?php if($has_video) { ?>
<meta property="og:url" content=<?php echo 'http://instilive.com/share.php?notice='.$notice_id ?> />
<meta property="og:video" content=<?php echo '"'.$result['video_url'].'"'?> />
<meta property="og:video:height" content="385" />
<meta property="og:video:width" content="640" />
<meta property="og:video:type" content="application/x-shockwave-flash" />
<?php } else { ?>
<meta property="og:url" content=<?php echo 'http://instilive.com/share.php?notice='.$notice_id ?> />
<meta property="og:image" content=<?php echo '"'.$main_image.'"'?> />
<?php } ?>
<meta property="og:description" content=<?php echo '"'.$result['description'].'"'?> />
<meta property="og:site_name" content=<?php echo '"' .$name.'"' ?> />
<meta property="article:published_time" content=<?php echo '"' .$result['created'].'"' ?> />
<meta property="article:modified_time" content=<?php echo '"' .$result['modified'].'"' ?> />
</head>

<body>
    <?php
        //print_r($result);
    ?>
    <script type="text/javascript">
        (function(){
            window.location.href = '<?php echo($front_root.'home/direct/'.$notice_id); ?>';
        })();
    </script>
</body>

</html>

