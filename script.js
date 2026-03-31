document.addEventListener('DOMContentLoaded', function() {
    var citations = document.querySelectorAll('.footnote-citation');
    var wide = window.innerWidth > 1200;

    function positionFootnotes() {
        if (!wide) return;
        var bodyTop = document.body.getBoundingClientRect().top;
        var lastBottom = 0;

        citations.forEach(function(citation) {
            var footnote = document.getElementById(citation.getAttribute('href').substring(1));
            if (!footnote) return;

            var top = citation.getBoundingClientRect().top - bodyTop - footnote.offsetHeight / 2;
            if (top < lastBottom) top = lastBottom;

            footnote.style.top = top + 'px';
            lastBottom = top + footnote.offsetHeight + 16;
        });
    }

    document.querySelectorAll('.footnote').forEach(function(el) {
        var words = el.textContent.trim().split(/\s+/);
        if (words.length <= 60) return;

        var fullHTML = el.innerHTML;
        var truncated = words.slice(0, 60).join(' ');

        var previewSpan = document.createElement('span');
        previewSpan.className = 'footnote-preview';
        previewSpan.textContent = truncated;

        var fullSpan = document.createElement('span');
        fullSpan.className = 'footnote-full';
        fullSpan.innerHTML = fullHTML;
        fullSpan.style.display = 'none';

        var toggleBtn = document.createElement('button');
        toggleBtn.className = 'footnote-toggle';
        toggleBtn.textContent = '...more';

        el.innerHTML = '';
        el.appendChild(previewSpan);
        el.appendChild(fullSpan);
        el.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', function() {
            var expanded = fullSpan.style.display !== 'none';
            previewSpan.style.display = expanded ? '' : 'none';
            fullSpan.style.display = expanded ? 'none' : '';
            toggleBtn.textContent = expanded ? '...more' : ' ...less';
            positionFootnotes();
        });
    });

    positionFootnotes();

    if (!wide) return;

    citations.forEach(function(citation) {
        citation.addEventListener('click', function(e) {
            e.preventDefault();
            var footnote = document.getElementById(citation.getAttribute('href').substring(1));
            if (!footnote) return;

            var rect = footnote.getBoundingClientRect();
            var inView = rect.top >= 0 && rect.bottom <= window.innerHeight;

            function flash() {
                footnote.classList.add('highlight');
                setTimeout(function() {
                    footnote.classList.remove('highlight');
                }, 500);
            }

            if (inView) {
                flash();
            } else {
                footnote.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(flash, 400);
            }
        });
    });
});
