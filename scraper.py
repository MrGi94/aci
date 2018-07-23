import re
import time
import urllib3
import requests as r
import sys
import json
import cgi
import posting

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.ui import WebDriverWait
from credentials import get_email, get_pw

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


# url - the url to fetch dynamic content from.
# delay - second for web view to wait
# scrolls - number of page scrolls
def fetch_html_for_the_page(url, delay):
    # open the driver with the URL
    # a browser windows will appear for a little while
    driver.get(url)
    scroll_page()
    try:
        # check for presence of the element you're looking for
        element_present = ec.presence_of_element_located((By.XPATH, '//span class="_4arz"'))
        WebDriverWait(driver, delay).until(element_present)

    # unless found, catch the exception
    except TimeoutException:
        print('Loading took too much time!')

    # return html
    return driver.page_source


def scroll_page():
    # Initialize page scrolling
    scroll_pause_time = 0.5

    # Get scroll height
    last_height = driver.execute_script("return document.body.scrollHeight")
    i = 0

    while i <= number_of_scroll:
        # Scroll down to bottom
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Wait to load page
        time.sleep(scroll_pause_time)

        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height
        i = i + 1


def fb_login():
    try:
        driver.get('https://www.facebook.com')
        driver.find_element_by_id('email').send_keys(get_email())
        driver.find_element_by_id('pass').send_keys(get_pw())
        driver.find_element_by_id('loginbutton').click()
    except NoSuchElementException:
        print('Already logged in!')


def parse_number(text: str) -> int:
    try:
        return int(re.findall('\d{1,8}', re.sub(',', '', re.sub('\.', '', text)))[0]) if text is not None else 0
    except TypeError and IndexError:
        return 0


def is_amazon(message: str) -> bool:
    return bool(re.search('amzn.to', message))


def check_if_none(value):
    if value is not None:
        value = value.text
    else:
        value = ''
    return value


def get_video_source(url: str) -> str:
    video_html = r.get(url)
    video_url = re.search('hd_src:"(.+?)"', video_html.text)
    if video_url is None:
        video_url = re.search('sd_src:"(.+?)"', video_html.text)
    if video_url is not None:
        return video_url.group(1)
    else:
        return ''


def get_top_comment(source, total_likes) -> str:
    comments = source.find_all('div', class_='UFICommentContent')
    comment_text = ''
    for comment in comments:
        comment_likes_block = comment.find('span', class_='_3t54')
        comment_likes = 0
        if comment_likes_block is not None:
            for x in range(len(comment_likes_block.contents)):
                comment_likes += parse_number(comment_likes_block.contents[x].text)
        else:
            continue
        if comment_likes > total_likes:
            comment_text = comment.find('span', class_='UFICommentBody').text
    return comment_text


# Declaring global variable
global number_of_scroll
number_of_scroll = 3
postings = []
# Declaring the web page
page_name = 'BesteUnterhaltungx.WhiteTaiger'
# page_name = 'FrauenMitStil'
page_url = 'https://www.facebook.com/pg/' + page_name + '/posts/?ref=page_internal'
head = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) Apple '
                      'WebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}

# Declaring the list to store data in
fs = cgi.FieldStorage()
sys.stdout.write("Content-Type: application/json")
sys.stdout.write("\n")

# Set path and options for web browser
chrome_options = Options()
chrome_options.add_argument('--disable-extensions')
chrome_options.add_argument('--disable-notifications')
driver = webdriver.Chrome('C:/Users/Andre/Documents/chromedriver/chromedriver.exe', chrome_options=chrome_options)

# initiate web browser and log in to facebook
fb_login()

# call the fetching function we created
html = fetch_html_for_the_page(page_url, 4 + number_of_scroll * 2)

if html is not None:
    # grab HTML document
    start_soup = BeautifulSoup(html, 'html.parser')

    # Pattern to remove all non-alphanumeric characters except spaces
    pattern = re.compile('[^\s\w\-&]|_', re.UNICODE)

    # Scrape total number of movies
    total_posts = start_soup.find_all('div', class_='_5pcr userContentWrapper')

    # For every page
    for post in total_posts:
        # Scrape the post date in unix time
        tmp = post.find('abbr')
        post_date = tmp['data-utime']

        # Scrape the post link
        post_link = 'https://www.facebook.com' + tmp.parent['href']

        # Scrape the post likes
        post_likes = parse_number(check_if_none(post.find('span', class_='_4arz')))

        # Scrape the post comments
        post_comments = parse_number(check_if_none(post.find('a', class_='_ipm _-56')))

        # Scrape through comments to find top comment
        comment_section = post.find('div', class_='_3b-9 _j6a')
        post_top_comment = get_top_comment(comment_section.extract(), post_likes * 0.002 + 9) \
            if comment_section is not None else ''

        # Scrape the post message and check for amazon post
        post_message = check_if_none(post.find('div', class_='_5pbx userContent _3576'))
        post_alt_message = ''
        post_amazon = is_amazon(post_message)

        # Scrape the post shares
        post_shares = parse_number(check_if_none(post.find('a', class_='_ipm _2x0m')))

        # Scrape the image link/s
        gallery = post.find_all('a', {'rel': 'theater'})
        post_external_link = ''
        post_img_link = ''
        post_video_views = 0
        if gallery:
            for img in gallery:
                try:
                    post_img_link += img['data-ploi'] + ';'
                except KeyError:
                    pass

            # Scrape message from original posting if it exists
            post_alt_message = check_if_none(post.find('div', class_='mtm _5pco'))

            # Scrape the post type
            if len(gallery) > 2:
                post_type = 'gallery'
            else:
                post_type = 'image' if post_alt_message == '' else 'shared'
                post_amazon = post_amazon if post_alt_message == '' else is_amazon(post_alt_message)
        else:
            tmp = post.find('div', class_='_6ks')
            if tmp is not None:
                post_type = 'external'
                # Scrape external publisher link
                post_external_link = tmp.a['href']
            else:
                tmp = post.find('img', class_='_3chq')
                post_type = 'video'
                # Scrape video source link
                post_external_link = get_video_source(post_link)
                # Scrape video calls
                post_video_views = parse_number(check_if_none(post.find('span', class_='_ipm _2x0m')))
            if tmp is not None:
                try:
                    post_img_link = tmp['src']
                except KeyError:
                    pass
        # Insert post in database
        postings.append(posting.Posting(post_link=post_link, post_date=post_date, post_message=post_message,
                                        post_type=post_type, post_likes=post_likes, post_comments=post_comments,
                                        post_shares=post_shares, post_img_link=post_img_link,
                                        post_external_link=post_external_link, post_amazon=post_amazon,
                                        post_alt_message=post_alt_message, post_top_comment=post_top_comment,
                                        post_video_views=post_video_views))
    # close the browser
    driver.quit()

result = {'success': True, 'data': postings}
sys.stdout.write(json.dumps(result, indent=1))
sys.stdout.close()
