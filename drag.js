function makeDragAble() {

    var dragSrcEl = null;

    function handleDragStart(e) {
    this.style.opacity = '0.4';

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    //copy data from picked up element
    e.dataTransfer.setData('title', this.innerHTML);
    e.dataTransfer.setData('year_start', this.getAttribute('year_start'));
    e.dataTransfer.setData('year_end', this.getAttribute('year_end'));
    }

    function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';

    return false;
    }

    function handleDragEnter(e) {
    this.classList.add('over');
    }

    function handleDragLeave(e) {
    this.classList.remove('over');
    }

    function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }

    if (dragSrcEl != this) {
        //save data to dragged element
        dragSrcEl.innerHTML = this.innerHTML
        dragSrcEl.setAttribute('year_start', this.getAttribute('year_start'))
        dragSrcEl.setAttribute('year_end', this.getAttribute('year_end'))

        //save data to other element
        this.innerHTML = e.dataTransfer.getData('title')
        this.setAttribute('year_start', e.dataTransfer.getData('year_start'))
        this.setAttribute('year_end', e.dataTransfer.getData('year_end'))
    }

    return false;
    }

    function handleDragEnd(e) {
    this.style.opacity = '1';

    items.forEach(function (item) {
        item.classList.remove('over');
    });
    }

    let items = document.querySelectorAll('.quiz-container .box');
    items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragenter', handleDragEnter, false);
    item.addEventListener('dragover', handleDragOver, false);
    item.addEventListener('dragleave', handleDragLeave, false);
    item.addEventListener('drop', handleDrop, false);
    item.addEventListener('dragend', handleDragEnd, false);
    });
}