class Posting:

    def __init__(self, **kwargs):
        self.post_link = kwargs.get('post_link', None)
        self.post_date = kwargs.get('post_date', None)
        self.post_message = kwargs.get('post_message', None)
        self.post_type = kwargs.get('post_type', None)
        self.post_likes = kwargs.get('post_likes', None)
        self.post_comments = kwargs.get('post_comments', None)
        self.post_shares = kwargs.get('post_shares', None)
        self.post_img_link = kwargs.get('post_img_link', None)
        self.post_external_link = kwargs.get('post_external_link', None)
        self.post_amazon = kwargs.get('post_amazon', None)
        self.post_alt_message = kwargs.get('post_alt_message', None)
        self.post_top_comment = kwargs.get('post_top_comment', None)
        self.post_video_views = kwargs.get('page_name', None)
