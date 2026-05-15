import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createArticle, getArticle, updateArticle } from '../api/endpoints/articles.js';
import { parseApiErrors } from '../api/parseErrors.js';
import { ErrorList } from '../components/ErrorList.js';

export function EditorPage() {
  const { slug } = useParams<{ slug?: string }>();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getArticle(slug)
      .then(({ article }) => {
        setTitle(article.title);
        setDescription(article.description);
        setBody(article.body ?? '');
        setTagsInput(article.tagList.join(' '));
      })
      .catch((err) => setErrors(parseApiErrors(err)));
  }, [slug]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);
    try {
      const tagList = tagsInput
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const res = isEdit
        ? await updateArticle(slug!, { title, description, body })
        : await createArticle({ title, description, body, tagList });
      navigate(`/article/${res.article.slug}`);
    } catch (err) {
      setErrors(parseApiErrors(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <h1>{isEdit ? 'Edit article' : 'New article'}</h1>
            <ErrorList errors={errors} />
            <form onSubmit={onSubmit}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="What's this article about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                  />
                </fieldset>
                {!isEdit && (
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter tags (space-separated)"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                    />
                  </fieldset>
                )}
                <button className="btn btn-lg pull-xs-right btn-primary" type="submit" disabled={submitting}>
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
