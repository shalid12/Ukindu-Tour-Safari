document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.zanzibar-tour-listing .package-wrapper3').forEach(function (card) {
    var image = card.querySelector('.image-area');
    var content = card.querySelector('.content');
    var headingLink = card.querySelector('.content .title a');
    var duration = card.querySelector('.meta-content');

    if (image && duration && !image.querySelector('.zanzibar-tour-badge')) {
      var badge = document.createElement('span');
      badge.className = 'zanzibar-tour-badge';
      badge.textContent = duration.textContent.trim().replace(/\s+/g, ' ');
      image.appendChild(badge);
      duration.remove();
    }
    if (!content || !headingLink || content.querySelector('.zanzibar-tour-link')) return;

    if (!content.querySelector('.zanzibar-tour-meta')) {
      var category = document.createElement('p');
      category.className = 'zanzibar-tour-category';
      category.textContent = document.body.classList.contains('zanzibar-fullday-listing')
        ? 'Zanzibar · Full-Day Experience'
        : 'Zanzibar · Half-Day Experience';
      content.insertBefore(category, content.querySelector('.title'));
    }

    var title = headingLink.textContent.trim().replace(/\s+/g, ' ');
    var action = document.createElement('a');
    action.className = 'zanzibar-tour-link';
    action.href = headingLink.href;
    action.setAttribute('aria-label', 'View tour: ' + title);
    action.innerHTML = 'View tour <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
    var foot = document.createElement('div');
    foot.className = 'zanzibar-tour-card-foot';
    foot.appendChild(action);
    content.appendChild(foot);
  });
});
